// src/stores/userStore.js
import { makeAutoObservable, runInAction } from 'mobx'
import userService from '../api/userService'
import commonStore from './commonStore'
import teamStore from './teamStore';
import { autorun } from 'mobx'
class UserStore {
  me = null;
  isLoadingMe = false;          // загрузка профиля
  isLoadingAdmin = false;       // загрузка флагов админов
  isAdminByTeam = new Map();    // командные админ-флаги
  isMainAdmin = null;           // null = ещё не узнали, true/false = результат
  selectedTeamId = null;


  setMe(me) {
    this.me = me
  }

  constructor() {
    makeAutoObservable(this);
    this.selectedTeamId = Number(localStorage.getItem("teamId")) || null;

    // как только придёт профиль или сменится команда — проверяем роли
    autorun(() => {
      const uid = this.me?.id;
      const tid = this.selectedTeamId;
      if (uid && tid != null) {
        this.checkAdmins(uid, tid);
      } else {
        // сбрасываем состояние ожидания и флаги
        runInAction(() => {
          this.isMainAdmin = null;
          this.isAdminByTeam.delete(tid);
        });
      }
    });
  }

  /** общий флаг: либо главный админ, либо командный админ */
  get isAdmin() {
    if (this.isMainAdmin === null) return false; // пока не узнали — считаем нет
    if (this.isMainAdmin) return true;
    const tid = this.selectedTeamId;
    return tid != null ? this.isAdminByTeam.get(tid) || false : false;
  }

  /** Загрузить профиль текущего пользователя */
  async fetchMe() {
    const token = commonStore.token;
    if (!token) return;
    runInAction(() => {
      this.isLoadingMe = true;
      this.me = null;
      this.isMainAdmin = null;
      this.isAdminByTeam.clear();
    });
    try {
      const me = await userService.getCurrentUser();
      runInAction(() => {
        this.me = me;
      });
    } catch {
      commonStore.clearAuth();
      runInAction(() => {
        this.me = null;
      });
    } finally {
      runInAction(() => {
        this.isLoadingMe = false;
      });
    }
  }

  /**
   * Проверить сразу два флага:
   *  — главный админ (isUserMainAdmin)
   *  — админ конкретной команды (isUserAdmin)
   */
  async checkAdmins(userId, teamId) {
    runInAction(() => {
      this.isLoadingAdmin = true;
      this.isMainAdmin = null;
      this.isAdminByTeam.delete(teamId);
    });
    try {
      const [teamAdmin, mainAdmin] = await Promise.all([
        userService.isUserAdmin(userId, teamId),
        userService.isUserMainAdmin(userId),
      ]);
      runInAction(() => {
        this.isAdminByTeam.set(teamId, teamAdmin);
        this.isMainAdmin = mainAdmin;
      });
    } catch {
      runInAction(() => {
        this.isAdminByTeam.set(teamId, false);
        this.isMainAdmin = false;
      });
    } finally {
      runInAction(() => {
        this.isLoadingAdmin = false;
      });
    }
  }

  async joinTeam(code) {
    if (!this.me) throw new Error("not signed in");
    await userService.joinTeam(this.me.id, code);
    await this.fetchMe();
  }

  async leaveTeam(code) {
    if (!this.me) throw new Error("not signed in");
    await userService.leaveTeam(this.me.id, code);
    await this.fetchMe();
  }

  clearCurrentUser() {
    runInAction(() => {
      this.me = null;
      this.isMainAdmin = null;
      this.isAdminByTeam.clear();
      this.selectedTeamId = null;
      localStorage.removeItem("teamId");
    });
  }
}

export default new UserStore();
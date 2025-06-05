

import { makeAutoObservable, runInAction } from 'mobx'
import AuthService from '../api/authService'
import UserService from '../api/userService'
import userStore from './userStore'
class CommonStore {
  token = "";
  refreshToken = "";
  userId = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    const saved = localStorage.getItem("auth");
    if (saved) {
      const { token, refreshToken, userId } = JSON.parse(saved);
      this.token = token;
      this.refreshToken = refreshToken;
      this.userId = userId;
      this.isAuthenticated = !!token;
    }
  }

  setAuth({ token, refreshToken, userId }) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.userId = userId;
    this.isAuthenticated = true;
    localStorage.setItem(
      "auth",
      JSON.stringify({ token, refreshToken, userId })
    );
  }

  clearAuth() {
    this.token = "";
    this.refreshToken = "";
    this.userId = null;
    this.isAuthenticated = false;
    localStorage.removeItem("auth");
    userStore.clearCurrentUser();
  }

  async signIn({ username, password }) {
  // получаем токены
  const { accessToken, refreshToken } = await AuthService.signIn({ username, password });
  if (!accessToken) throw new Error("Не получили accessToken");

  // сразу сохраняем их, чтобы tokenPlugin работал
  runInAction(() => {
    this.setAuth({ token: accessToken, refreshToken, userId: null });
  });

  // теперь запрос профиля придёт с Authorization: Bearer …
  const me = await UserService.getCurrentUser();

  // и только теперь дополняем userId
  runInAction(() => {
    this.userId = me.id;
    userStore.setMe(me);
    // перезапишем в локалсторадже уже с верным userId
    localStorage.setItem("auth",
      JSON.stringify({ token: accessToken, refreshToken, userId: me.id })
    );
  });

  return me;
}

async signUp({ username, fullname, email, password, confirm }) {
  const { accessToken, refreshToken } = await AuthService.signUp({ username, fullname, email, password, confirm });
  if (!accessToken) throw new Error("Не получили accessToken");

  runInAction(() => {
    this.setAuth({ token: accessToken, refreshToken, userId: null });
  });

  const me = await UserService.getCurrentUser();

  runInAction(() => {
    this.userId = me.id;
    userStore.setMe(me);
    localStorage.setItem("auth",
      JSON.stringify({ token: accessToken, refreshToken, userId: me.id })
    );
  });

  return me;
}


  async refresh() {
    const { accessToken, refreshToken } = await AuthService.refresh({
      refreshToken: this.refreshToken,
    });
    runInAction(() => {
      this.token = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: accessToken,
          refreshToken,
          userId: this.userId,
        })
      );
    });
    return { accessToken, refreshToken };
  }

  signOut() {
    this.clearAuth();
  }
}

export default new CommonStore();
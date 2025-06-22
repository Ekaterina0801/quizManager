import { makeAutoObservable, runInAction } from 'mobx'
import eventService from '../api/eventService'
import teamService from '../api/teamService'
import userStore from './userStore'
import teamStore from './teamStore'
class EventStore {
  events = [];
  current = null;
  isLoading = false;
  eventsPage = null;  
  page       = 0;
  size       = 10;
  sort       = "dateTime,desc";
  search     = "";


  constructor() {
    makeAutoObservable(this);
  }

  setSearch(q) {
    this.search = q;
    this.page = 0;
    this.fetchForTeam();
  }

  setPage(p) {
    this.page = p;
    this.fetchForTeam();
  }

  setSize(s) {
    this.size = s;
    this.page = 0;
    this.fetchForTeam();
  }

  setSort(sort) {
    this.sort = sort;
    this.fetchForTeam();
  }


  

  async fetchEvent(id) {
    runInAction(() => this.isLoading = true);
    try {
      const ev = await eventService.getEventById(id);
      //eventService.getById(id);
      runInAction(() => this.current = ev);
    } finally {
      runInAction(() => this.isLoading = false);
    }
  }


  async fetchForTeam() {
    const team = teamStore.selected;
    if (!team?.id) throw new Error("Нет выбранной команды");
    this.isLoading = true;
    try {
      const page = await eventService.fetchEvents({
        teamId: team.id,
        page:   this.page,
        size:   this.size,
        sort:   this.sort,
        search: this.search
      });
      runInAction(() => {
        this.eventsPage = page;
        console.log("EventsPage", page);
      });
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  /**
   * Создание события и автоматическое обновление списка
   * @param {object} eventData — { date, time, title, location, description, posterFile }
   */
  async create(eventData) {
    const team = teamStore.selected
    const user = userStore.me
    console.log("create event", team.id, user.id)
    if (!team?.id || !user?.id) {
      throw new Error("Нет текущей команды или пользователя")
    }

    this.isLoading = true
    try {
      // 1) отправляем создание
      await eventService.createEvent(user.id, team.id, eventData)

      // 2) потом просто заново вызываем наш же fetchForTeam,
      //    который подставит team.id и обновит this.events
      await this.fetchForTeam(team.id)
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  async update(id, data) {
    this.isLoading = true;
    try {
      await eventService.updateEvent(id, data);
      runInAction(() => {
        this.current = this.fetchEvent(id);
        this.events = this.events.map(x =>
          x.id === updated.id ? updated : x
        );
      });
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async delete(id) {
    const team = teamStore.selected, user = userStore.me;
    if (!team || !user) throw new Error('No team or user');
    runInAction(() => this.isLoading = true);
    try {
      await eventService.deleteEvent(id, user.id);
      runInAction(() => {
        this.events = this.events.filter(x => x.id !== id);
        if (this.current?.id === id) this.current = null;
      });
    } finally {
      runInAction(() => this.isLoading = false);
    }
  }

  async register(eventId, fullName) {
  const user = userStore.me;
  if (!user?.id) throw new Error("Пользователь не авторизован");

  try {
    await eventService.registerForEvent(eventId, {
      userId:   user.id,
      fullName,
    });
  } catch (err) {
    if (!/Parser is unable to parse/.test(err.message)) {
      throw err;
    }
  }

  // после любого успешного запроса (или "успешного" parse-error) — подтягиваем
  await this.fetchEvent(eventId);
}

  /** Отписаться + обновить registrations */
  async unregister(eventId, registrationId) {
    const user = userStore.me;
    if (!user?.id) throw new Error("Пользователь не авторизован");
    await eventService.unregisterFromEvent(eventId, registrationId, user.id);
    await this.fetchEvent(eventId);
  }
}

export default new EventStore();
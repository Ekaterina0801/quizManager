import { makeAutoObservable, runInAction } from "mobx";
import TeamNotificationAPI from "../api/teamNotificationsApi";

class NotificationStore {
  notifications = {};
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchNotificationSettings(teamId) {
    this.isLoading = true;
    try {
      const settings = await TeamNotificationAPI.getSettingsForTeam(teamId);
      console.log("Загруженные настройки:", settings);
      runInAction(() => {
        this.notifications[teamId] = settings;
      });
      return settings;
    } catch (error) {
      console.error("Ошибка при загрузке настроек:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updateNotificationSettings(teamId, updatedSettings) {
    this.isLoading = true;
    console.log(updatedSettings);
    try {
      const updated = await TeamNotificationAPI.createOrUpdateSettings(teamId, updatedSettings);
      console.log("Настройки сохранены");
      runInAction(() => {
        this.notifications[teamId] = updated;
      });
      return updated;
    } catch (error) {
      console.error("Ошибка при обновлении настроек:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

const notificationStore = new NotificationStore();
export default notificationStore;

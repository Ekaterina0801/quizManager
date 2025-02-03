import { makeAutoObservable } from "mobx";
import NotificationAPI from "../api/notificationApi";

class NotificationStore {
    notifications = {};
    isLoading = false;
  
    constructor() {
      makeAutoObservable(this);
    }
  
    async fetchNotificationSettings(teamId) {
      this.isLoading = true;
      try {
        const settings = await NotificationAPI.getTeamNotificationSettings(teamId);
        this.notifications[teamId] = settings;
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      } finally {
        this.isLoading = false;
      }
    }
  
    async updateNotificationSettings(teamId, updatedSettings) {
      this.isLoading = true;
      try {
        const updated = await NotificationAPI.updateTeamNotificationSettings(teamId, updatedSettings);
        this.notifications[teamId] = updated;
      } catch (error) {
        console.error("Error updating notification settings:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
  
  const notificationStore = new NotificationStore();
  export default notificationStore;
  
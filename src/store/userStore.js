
import { makeAutoObservable } from "mobx";
import UserAPI from "../api/userApi";

class UserStore {
    users = [];
    selectedUser = null;
    isLoading = false;
  
    constructor() {
      makeAutoObservable(this);
    }
  
    async fetchUsers() {
      this.isLoading = true;
      try {
        const users = await UserAPI.getAllUsers();
        this.users = users;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    }
  
    async fetchUserById(userId) {
      this.isLoading = true;
      try {
        const user = await UserAPI.getUserById(userId);
        this.selectedUser = user;
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        this.isLoading = false;
      }
    }
  
    async assignAdminRole(userId, teamId) {
      try {
        await AdminAPI.makeAdmin(userId, teamId);
        this.fetchUserById(userId); // Обновляем информацию о пользователе
      } catch (error) {
        console.error("Error assigning admin role:", error);
      }
    }
  
    async removeAdminRole(userId, teamId) {
      try {
        await AdminAPI.removeAdmin(userId, teamId);
        this.fetchUserById(userId); // Обновляем информацию о пользователе
      } catch (error) {
        console.error("Error removing admin role:", error);
      }
    }
  }
  
  const userStore = new UserStore();
  export default userStore;

  
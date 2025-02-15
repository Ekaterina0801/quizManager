
import { makeAutoObservable } from "mobx";
import UserAPI from "../api/userApi";
import teamStore from "./teamStore";
import { runInAction } from "mobx";
class UserStore {
    users = [];
    selectedUser = null;
    isLoading = false;
    isAdmin = false;  
    
    constructor() {
      makeAutoObservable(this);
      this.loadFromLocalStorage();
    }


  
    loadFromLocalStorage() {
      const savedUsers = sessionStorage.getItem("users");
      const savedSelectedUser = sessionStorage.getItem("selectedUser");
    console.log('savedUsers',savedUsers);
    console.log('savedSelectedUser',savedSelectedUser);
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
  
      if (savedSelectedUser) {
        this.selectedUser = JSON.parse(savedSelectedUser);
      }
    }
  
    saveToLocalStorage(userId) {
        console.log('userId',userId);
    sessionStorage.setItem("selectedUser", JSON.stringify(userId));
    }
  
    async fetchUsers() {
      this.isLoading = true;
      try {
        const users = await UserAPI.getAllUsers();
        this.users = users;
        this.saveToLocalStorage(); 
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
          
          runInAction(() => {
            this.selectedUser = user.id;
            this.saveToLocalStorage(user.id);
          });
      
          await this.checkIfUserIsAdmin(user.id); 
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          runInAction(() => {
            this.isLoading = false;
          });
        }
      }
      
      
  
      async checkIfUserIsAdmin(userId) {
        const teamId = teamStore.selectedTeamId;
        console.log("teamId:", teamId);
      
        if (!userId || !teamId) return; // Проверяем, есть ли userId и teamId
      
        try {
          const isAdmin = await UserAPI.isUserAdmin(userId, teamId);
          console.log("isAdmin:", isAdmin);
      
          runInAction(() => { 
            this.isAdmin = isAdmin;
          });
        } catch (error) {
          console.error("Error checking if user is admin:", error);
        }
      }
      
      
  
    async assignAdminRole(userId, teamId) {
      try {
        await AdminAPI.makeAdmin(userId, teamId);
        this.fetchUserById(userId); 
      } catch (error) {
        console.error("Error assigning admin role:", error);
      }
    }
  
    async removeAdminRole(userId, teamId) {
      try {
        await AdminAPI.removeAdmin(userId, teamId);
        this.fetchUserById(userId);
      } catch (error) {
        console.error("Error removing admin role:", error);
      }
    }
  }
  
  const userStore = new UserStore();
  export default userStore;
  
import TeamAPI from "../api/teamApi";
import { makeAutoObservable, runInAction } from "mobx";
class TeamStore {
    teams = [];
    selectedTeam = null;
    isLoading = false;
  
    constructor() {
      makeAutoObservable(this);
  
      const savedTeam = sessionStorage.getItem("selectedTeam");
      if (savedTeam) {
        this.selectedTeam = JSON.parse(savedTeam);
      }
  
      const savedTeamId = sessionStorage.getItem("selectedTeamId");
      if (savedTeamId) {
        this.selectedTeamId = JSON.parse(savedTeamId);
      }
    }
  
    // Загрузка всех команд
    async fetchTeams() {
      this.isLoading = true;
      try {
        const teams = await TeamAPI.getAllTeams();
        this.teams = teams;
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        this.isLoading = false;
      }
    }
  
    // Загрузка команды по ID
    async fetchTeamById(teamId) {
      this.isLoading = true;
      try {
        const team = await TeamAPI.getTeamById(teamId);
        runInAction(() => {
          this.selectedTeam = team;
          sessionStorage.setItem("selectedTeam", JSON.stringify(team)); 
          sessionStorage.setItem("selectedTeamId", JSON.stringify(team.id)); 
          console.log("Updated selectedTeam:", this.selectedTeam);
        });
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        runInAction(() => {
          this.isLoading = false;
        });
      }
    }
  
    // Добавление пользователя в команду
    async addUserToTeam(teamId, userId, role) {
      try {
        await TeamAPI.addUserToTeam(teamId, userId, role);
        await this.fetchTeamById(teamId); 
      } catch (error) {
        console.error("Error adding user to team:", error);
      }
    }
  
    // Удаление пользователя из команды
    async removeUserFromTeam(teamId, userId) {
      try {
        await TeamAPI.removeUserFromTeam(teamId, userId);
        await this.fetchTeamById(teamId); 
      } catch (error) {
        console.error("Error removing user from team:", error);
      }
    }
  
    // Очистка выбранной команды
    clearSelectedTeam() {
      this.selectedTeam = null;
      sessionStorage.removeItem("selectedTeam"); 
      sessionStorage.removeItem("selectedTeamId"); 
    }
  

// Сохранение ID выбранной команды
saveSelectedTeamId(teamId) {
  sessionStorage.setItem("selectedTeamId", teamId); 
  runInAction(() => {
    this.selectedTeamId = teamId; 
  });
}

  }
  
  const teamStore = new TeamStore();
  export default teamStore;
  
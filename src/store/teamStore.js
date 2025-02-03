import { makeAutoObservable } from "mobx";
import TeamAPI from "../api/teamApi";
class TeamStore {
    teams = [];
    selectedTeam = null;
    isLoading = false;
  
    constructor() {
      makeAutoObservable(this);
    }
  
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
  
    async fetchTeamById(teamId) {
      this.isLoading = true;
      try {
        const team = await TeamAPI.getTeamById(teamId);
        this.selectedTeam = team;
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        this.isLoading = false;
      }
    }
  
    async addUserToTeam(teamId, userId, role) {
      try {
        await TeamAPI.addUserToTeam(teamId, userId, role);
        this.fetchTeamById(teamId); // обновляем команду после добавления
      } catch (error) {
        console.error("Error adding user to team:", error);
      }
    }
  
    async removeUserFromTeam(teamId, userId) {
      try {
        await TeamAPI.removeUserFromTeam(teamId, userId);
        this.fetchTeamById(teamId); // обновляем команду после удаления
      } catch (error) {
        console.error("Error removing user from team:", error);
      }
    }
  }
  
  const teamStore = new TeamStore();
  export default teamStore;
  
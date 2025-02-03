import axios from 'axios';

import { BACKEND_URL } from './apiConfig';
const API_BASE_URL = `${BACKEND_URL}/teams`;

const TeamAPI = {
  // Создать новую команду
  createTeam: async (teamName, chatId) => {
    try {
      const response = await axios.post(API_BASE_URL, null, {
        params: { teamName, chatId },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  },

  // Получить все команды
  getTeams: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
  },

  // Получить команду по ID
  getTeamById: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team:", error);
      throw error;
    }
  },

  // Получить команду по коду приглашения
  getTeamByInviteCode: async (inviteCode) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/invite/${inviteCode}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team by invite code:", error);
      throw error;
    }
  },

  // Добавить пользователя в команду
  addUserToTeam: async (teamId, userId, role) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${teamId}/addUser`, null, {
        params: { userId, role },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding user to team:", error);
      throw error;
    }
  },

  // Удалить пользователя из команды
  removeUserFromTeam: async (teamId, userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${teamId}/removeUser`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing user from team:", error);
      throw error;
    }
  },

  // Получить всех пользователей в команде
  getAllUsersInTeam: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${teamId}/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users in team:", error);
      throw error;
    }
  },

  // Получить все команды, в которых состоит пользователь
  getAllTeamsByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams by user:", error);
      throw error;
    }
  },

  // Получить настройки уведомлений для команды
  getTeamNotificationSettings: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${teamId}/notifications`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team notification settings:", error);
      throw error;
    }
  },

  // Обновить настройки уведомлений для команды
  updateTeamNotificationSettings: async (teamId, updatedSettings, userId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${teamId}/notifications`, updatedSettings, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating team notification settings:", error);
      throw error;
    }
  },
};

export default TeamAPI;

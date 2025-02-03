import axios from 'axios';

import { BACKEND_URL } from './apiConfig';
const API_BASE_URL = `${BACKEND_URL}/team-notifications`;

const TeamNotificationAPI = {
  // Получить настройки уведомлений для команды
  getSettingsForTeam: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching settings for team:", error);
      throw error;
    }
  },

  // Создать или обновить настройки уведомлений для команды
  createOrUpdateSettings: async (teamId, settings) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${teamId}`, settings);
      return response.data;
    } catch (error) {
      console.error("Error saving settings for team:", error);
      throw error;
    }
  },

  // Удалить настройки уведомлений для команды
  deleteSettings: async (teamId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting settings for team:", error);
      throw error;
    }
  }
};

export default TeamNotificationAPI;

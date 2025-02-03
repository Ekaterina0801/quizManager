import axios from 'axios';
import { BACKEND_URL } from './apiConfig';
const API_BASE_URL = `${BACKEND_URL}/admins`;

const AdminAPI = {
  // Назначить пользователя администратором
  makeAdmin: async (userId, teamId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/makeAdmin/${userId}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error assigning admin role:", error);
      throw error;
    }
  },

  // Удалить роль администратора у пользователя
  removeAdmin: async (userId, teamId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/removeAdmin/${userId}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing admin role:", error);
      throw error;
    }
  },

  // Получить всех пользователей с ролью администратора в команде
  getAdmins: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAdmins/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  },
};

export default AdminAPI;

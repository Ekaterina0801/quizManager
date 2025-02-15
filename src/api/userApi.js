import axios from 'axios';

import { BACKEND_URL } from './apiConfig';
const API_BASE_URL = `${BACKEND_URL}/users`;

const UserAPI = {
  // Создать пользователя по Telegram ID
  createUserByTelegramId: async (telegramId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create/${telegramId}`);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Получить пользователя по ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  // Получить пользователя по Telegram ID
  getUserByTelegramId: async (telegramId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/telegram/${telegramId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by Telegram ID:", error);
      throw error;
    }
  },

  // Добавить пользователя в команду
  addUserToTeam: async (telegramId, teamId, role) => {
    console.log(telegramId, teamId, role);
    try {
      const response = await axios.post(`${API_BASE_URL}/addUserToTeam`, null, {
        params: { telegramId, teamId, role },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding user to team:", error);
      throw error;
    }
  },

  // Получить всех пользователей
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  // Удалить пользователя по ID
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Обновить информацию о пользователе
  updateUserInfo: async (userId, firstName, lastName) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}/update`, null, {
        params: { firstName, lastName },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
  },

  // Получить список команд пользователя
  getTeamsByUser: async (telegramId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${telegramId}/teams`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams by user:", error);
      throw error;
    }
  },

  // Зарегистрировать пользователя в команду по inviteCode
  registerUserToTeam: async (telegramId, inviteCode) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${telegramId}/join`, null, {
        params: { inviteCode },
      });
      return response.data;
    } catch (error) {
      console.error("Error registering user to team:", error);
      throw error;
    }
  },

  // Удалить пользователя из команды
  removeUserFromTeam: async (telegramId, inviteCode) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${telegramId}/leave`, {
        params: { inviteCode },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing user from team:", error);
      throw error;
    }
  },

  // Получить всех участников команды
  getAllMembersOfTeam: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/team/${teamId}/members`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all team members:", error);
      throw error;
    }
  },

  // Проверить, является ли пользователь администратором команды
  isUserAdmin: async (userId, teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}/team/${teamId}/isAdmin`);
      return response.data;
    } catch (error) {
      console.error("Error checking if user is admin:", error);
      throw error;
    }
  },

  // Получить роль пользователя в команде
  getUserRoleInTeam: async (userId, teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}/team/${teamId}/role`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user role in team:", error);
      throw error;
    }
  },

  // Обновить роль пользователя в команде
  updateUserRole: async (userId, teamId, newRole) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}/team/${teamId}/updateRole`, null, {
        params: { newRole },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user role in team:", error);
      throw error;
    }
  },

  // Назначить пользователя администратором команды
  assignAdminRole: async (userId, teamId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}/team/${teamId}/assignAdmin`);
      return response.data;
    } catch (error) {
      console.error("Error assigning admin role:", error);
      throw error;
    }
  },

  // Убрать у пользователя права администратора
  revokeAdminRole: async (userId, teamId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}/team/${teamId}/revokeAdmin`);
      return response.data;
    } catch (error) {
      console.error("Error revoking admin role:", error);
      throw error;
    }
  },

  // Получить всех администраторов команды
  getAdminsByTeam: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/team/${teamId}/admins`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admins by team:", error);
      throw error;
    }
  }
};

export default UserAPI;

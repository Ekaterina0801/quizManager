import axios from 'axios';
import { BACKEND_URL } from './apiConfig';
const API_BASE_URL = `${BACKEND_URL}/telegram`;

const TelegramAPI = {
  // Отправка сообщения в чат
  sendMessage: async (chatId, message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sendMessage`, null, {
        params: { chatId, message },
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Получение информации о пользователе по ID
  getUserInfo: async (telegramId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUserInfo`, {
        params: { telegramId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },

  // Обработка входящего обновления (например, при старте бота)
  handleWebhookUpdate: async (update) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/webhook`, update);
      return response.data;
    } catch (error) {
      console.error("Error handling webhook update:", error);
      throw error;
    }
  },
};

export default TelegramAPI;


import axios from "axios";
import { BACKEND_URL } from './apiConfig';
const API_BASE_URL = `${BACKEND_URL}/events`;

const EventAPI = {
  getAllEvents: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },


  getEventById: async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event details:", error);
      throw error;
    }
  },

  createEvent: async (formData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при создании события: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Ответ от сервера:", data);


      return data;
    } catch (error) {
      console.error("Ошибка создания события:", error);
      throw error; 
    }
  },

  

  updateEvent: async (eventId, eventData) => {
    console.log('ed',eventData);
    try {
        await fetch(API_BASE_URL+`/${eventId}`, {
            method: "PUT",
            body: eventData,
          });
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  deleteEvent: async (eventId, userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${eventId}`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  registerForEvent: async (eventId, registrationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${eventId}/register`, registrationData);
      return response.data;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  },

  unregisterFromEvent: async (eventId, registrationId, telegramId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${eventId}/unregister`, null, {
        params: { registrationId, telegramId },
      });
      return response.data;
    } catch (error) {
      console.error("Error unregistering from event:", error);
      throw error;
    }
  },
};

export default EventAPI;
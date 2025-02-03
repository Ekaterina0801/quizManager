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

  getEventsByTeamId: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team events:", error);
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

  createEvent: async (eventData, imageFile, userId, teamId) => {
    try {
      const formData = new FormData();
      formData.append("eventData", JSON.stringify(eventData));
      if (imageFile) formData.append("imageFile", imageFile);
      formData.append("userId", userId);
      formData.append("teamId", teamId);
      
      const response = await axios.post(`${API_BASE_URL}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  updateEvent: async (eventId, eventData, imageFile, userId) => {
    try {
      const formData = new FormData();
      formData.append("eventData", JSON.stringify(eventData));
      if (imageFile) formData.append("imageFile", imageFile);
      formData.append("userId", userId);
      
      const response = await axios.put(`${API_BASE_URL}/${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
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
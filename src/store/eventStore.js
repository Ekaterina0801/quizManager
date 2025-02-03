import { makeAutoObservable } from "mobx";
import EventAPI from "../api/eventApi";

class EventStore {
    event = null;
    events = []; 
    isLoading = false;
    isEditing = false;
    isModalOpen = false;
    newParticipant = "";
    selectedTeamId = null; 
  
    constructor() {
      makeAutoObservable(this);
    }
  
    setTeamId(teamId) {
      this.selectedTeamId = teamId;
    }
  
    async fetchEventsForTeam() {
      if (this.selectedTeamId) {
        this.isLoading = true;
        try {
          const teamEvents = await EventAPI.getEventsByTeamId(this.selectedTeamId);
          this.events = teamEvents;
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          this.isLoading = false;
        }
      }
    }
  
    async fetchEvent(eventId) {
      this.isLoading = true;
      try {
        this.event = await EventAPI.getEventById(eventId);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        this.isLoading = false;
      }
    }
  
    async updateEvent(eventId, eventData, imageFile, userId) {
      try {
        await EventAPI.updateEvent(eventId, eventData, imageFile, userId);
        this.fetchEvent(eventId);
        this.isEditing = false;
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  
    async registerForEvent(eventId, registrationData) {
      try {
        await EventAPI.registerForEvent(eventId, registrationData);
        this.fetchEvent(eventId);
      } catch (error) {
        console.error("Error registering for event:", error);
      }
    }
  
    async unregisterFromEvent(eventId, registrationId, telegramId) {
      try {
        await EventAPI.unregisterFromEvent(eventId, registrationId, telegramId);
        this.fetchEvent(eventId);
      } catch (error) {
        console.error("Error unregistering from event:", error);
      }
    }
  }
  
  const eventStore = new EventStore();
  export default eventStore;
  
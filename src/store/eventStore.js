import { makeAutoObservable } from "mobx";
import EventAPI from "../api/eventApi";
import TeamAPI from "../api/teamApi";
import teamStore from "./teamStore";

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
      this.selectedTeamId = teamStore.selectedTeam ? teamStore.selectedTeam.id : null;
    }
  
    setTeamId(teamId) {
      this.selectedTeamId = teamId;
    }
  
    async fetchEventsForTeam() {
        console.log('id', this.selectedTeamId);
        if (this.selectedTeamId) {
            this.isLoading = true;
            try {
                const teamEvents = await TeamAPI.getEventsByTeamId(this.selectedTeamId);
                console.log('events', teamEvents);
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

    async createEvent(eventData, imageFile, userId) {
        console.log('eventData', eventData);
        if (!this.selectedTeamId) {
            console.error("No selected team ID. Cannot create event.");
            return;
        }
        
        try {
            this.isLoading = true;
            const newEvent = await EventAPI.createEvent(eventData, imageFile, userId, this.selectedTeamId);
            console.log(newEvent);
            this.events.push(newEvent);
        } catch (error) {
            console.error("Error creating event:", error);
        } finally {
            this.isLoading = false;
        }
    }

    async updateEvent(eventId, eventData, imageFile, userId) {
        console.log('eventData', eventData);
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

    async deleteEvent(eventId, userId) {
        try {
            await EventAPI.deleteEvent(eventId, userId);
            this.events = this.events.filter(event => event.id !== eventId);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }
    
}
  
const eventStore = new EventStore();
export default eventStore;

import EventsList from "../EventsList";
import Calendar from "../Calendar";
import TopBar from "../TopBar";
import teamStore from "../../store/teamStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import eventStore from "../../store/eventStore";
import EventModal from "../EventModal";
import userStore from "../../store/userStore";
const EventsPage = observer(() => {
    const { selectedTeamId } = teamStore;
    const teamId = selectedTeamId;
    const [viewMode, setViewMode] = useState("list");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newEvent, setNewEvent] = useState({
      date: "",
      time: "",
      title: "",
      location: "",
      description: "",
      posterUrl: "",
      posterFile: null,
    });
  
    const { selectedUser, isAdmin, isLoading, fetchUserById } = userStore;
  
    const userId = selectedUser;
  
    useEffect(() => {
      if (selectedUser) {
        console.log('selectedUser', selectedUser);
        fetchUserById(selectedUser);
      }
    }, [teamId, selectedUser]);
  
    useEffect(() => {
      if (teamId && selectedUser) {
        userStore.checkIfUserIsAdmin(selectedUser);
      }
    }, [teamId, selectedUser]);
  
    useEffect(() => {
      if (teamId) {
        eventStore.setTeamId(teamId);
        eventStore.fetchEventsForTeam();
      }
    }, [teamId]);
  
    const handleSwitchChange = (nextChecked) => {
      setViewMode(nextChecked ? "calendar" : "list");
    };
  
    const handleAddEvent = () => {
      setIsModalOpen(true);
    };
  
    const handleModalClose = () => {
      setIsModalOpen(false);
    };
  
    const handleInputChange = (e) => {
      setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };
  
    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setNewEvent({ ...newEvent, posterUrl: fileUrl, posterFile: file });
      }
    };
  
    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        if (!teamId || !selectedUser) {
          console.error("Ошибка: отсутствует teamId или userId.");
          return;
        }
    
        setIsSubmitting(true); 
    
        const formData = new FormData();
        formData.append("name", newEvent.title);
        formData.append("dateTime", `${newEvent.date}T${newEvent.time}:00`);
        formData.append("location", newEvent.location);
        formData.append("description", newEvent.description || "");
        formData.append("linkToAlbum", "");
        formData.append("teamResult", "");
        formData.append("teamId", teamId);
        formData.append("userId", selectedUser);
    
        if (newEvent.posterFile) {
          formData.append("imageFile", newEvent.posterFile);
        }
        console.log('userId', selectedUser);
        try {
          eventStore.setTeamId(teamId);
          await eventStore.createEvent(formData); 
          setIsModalOpen(false);
          setNewEvent({
            date: "",
            time: "",
            title: "",
            location: "",
            description: "",
            posterUrl: "",
            posterFile: null,
          });
        } catch (error) {
          console.error("Ошибка при создании события:", error);
        } finally {
          setIsSubmitting(false); 
        }
    };
    
  
    if (!teamId) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#ffffff] to-[#DCE6F5] via-[#DCE6F5]">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md w-full">
            <p className="text-xl font-semibold text-red-500">
              Ошибка: команда не выбрана
            </p>
          </div>
        </div>
      );
    }
  
    return (
        <div className="min-h-screen flex flex-col">
          <TopBar
            title=""
            showBackButton={false}
            onSwitchChange={handleSwitchChange}
            switchChecked={viewMode === "calendar"}
            showSettingsIcon={true}
          />
    
          <div className="flex-grow flex flex-col items-center pt-10 bg-transparent">
            <div className="max-w-5xl w-full bg-transparent p-4 rounded-3xl">
              {eventStore.isLoading ? (
                <div className="text-center text-gray-500">
                  Загрузка мероприятий...
                </div>
              ) : eventStore.events.length === 0 ? (
                <div className="text-center text-gray-500">Нет мероприятий</div>
              ) : (
                <div className="transition-opacity duration-300">
                  {viewMode === "list" ? (
                    <EventsList events={eventStore.events} />
                  ) : (
                    <Calendar events={eventStore.events} />
                  )}
                </div>
              )}
            </div>
          </div>
    
          {/* Кнопка для добавления события */}
          {isAdmin && (
            <button
              onClick={handleAddEvent}
              className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-[#732D87] text-white flex items-center justify-center shadow-xl hover:bg-[#5a1e67] transition-colors duration-300"
            >
              <span className="text-3xl font-bold">+</span>
            </button>
          )}
    
          {/* Модальное окно для добавления события */}
          <EventModal
            isModalOpen={isModalOpen}
            handleModalClose={handleModalClose}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            newEvent={newEvent}
            handleFileChange={handleFileChange}
          />
    
          {/* Спиннер, если отправка в процессе */}
          {isSubmitting && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#e4effc] flex items-center justify-center z-50">
            <div className="animate-spin rounded-full border-t-4 border-b-4 border-[#732D87] w-16 h-16">
            </div>
        </div>
          )}
        </div>
    );
    
  });
  
  export default EventsPage;
  
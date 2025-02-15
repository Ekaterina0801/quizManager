import { useState, useEffect } from "react";

import { observer } from "mobx-react-lite";
import eventStore from "../../store/eventStore";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EditEventModal from "../EditEventModal";
import teamStore from "../../store/teamStore";
import userStore from "../../store/userStore";
import defaultPoster from "../../assets/defaultPoster.jpg";

import { FaTimes } from "react-icons/fa";
const EventPage = observer(() => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { selectedTeamId } = teamStore;
  const {
    selectedUser,
    isAdmin,
    isLoading: isUserLoading,
    fetchUserById,
  } = userStore;
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setTelegramId(user.id.toString());
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserById(selectedUser);
      console.log("isAdm", isAdmin);
    }
  }, [selectedTeamId, selectedUser]);

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        await eventStore.fetchEvent(eventId);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleRegister = async () => {
    const registrationData = {
      telegramId: telegramId,
      fullName: newParticipant,
    };

    await eventStore.registerForEvent(eventId, registrationData);
    setIsModalOpen(false);
  };

  const handleUnregister = async (registrationId, telegramId) => {
    await eventStore.unregisterFromEvent(eventId, registrationId, telegramId);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();

    if (!selectedTeamId || !selectedUser) {
      console.error("Ошибка: отсутствует teamId или userId.");
      return;
    }

    if (
      !eventStore.event ||
      !eventStore.event.name ||
      !eventStore.event.dateTime ||
      !eventStore.event.location
    ) {
      console.error("Ошибка: отсутствуют данные события.");
      return;
    }

    const formData = new FormData();
    formData.append("name", eventStore.event.name);
    formData.append("dateTime", eventStore.event.dateTime);
    formData.append("location", eventStore.event.location);
    formData.append("description", eventStore.event.description || "");
    formData.append("linkToAlbum", eventStore.event.linkToAlbum || "");
    formData.append("teamResult", eventStore.event.teamResult || "");
    formData.append("teamId", selectedTeamId);
    formData.append("userId", selectedUser);

    if (eventStore.event.posterFile) {
      formData.append("imageFile", eventStore.event.posterFile);
    }

    try {
      await eventStore.updateEvent(eventId, formData);
      await eventStore.fetchEvent(eventId);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении события:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    eventStore.event[name] = value;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      eventStore.event.posterUrl = reader.result;
      eventStore.event.posterFile = file;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteEvent = async () => {
    try {
      await eventStore.deleteEvent(eventId, selectedUser);
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#e4effc] flex items-center justify-center z-50">
        <div className="animate-spin rounded-full border-t-4 border-b-4 border-[#732D87] w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#dfe7f7] to-[#b3c0d3]">
      <div className="pb-16 pt-6 sm:pb-24">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-4">
            <li>
              <a
                href="/quizManager/events"
                className="font-semibold text-m text-[#732D87]"
              >
                Мероприятия / {eventStore.event && eventStore.event.name}
              </a>
            </li>
          </ol>
        </nav>

        <div className="min-h-screen p-6 flex justify-center items-center">
          <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center gap-8 p-6 bg-[rgba(115,45,135,0.0)] rounded-3xl shadow-neomorph">
            {/* Image container */}
            <div className="lg:w-1/2 w-full flex justify-center items-center mb-6 lg:mb-0 relative rounded-3xl overflow-hidden bg-[#732D87] p-4 shadow-neomorph">
              {eventStore.event && eventStore.event.posterUrl ? (
                <img
                  src={eventStore.event?.posterUrl}
                  alt={`Poster for ${eventStore.event.name}`}
                  className="rounded-3xl w-full max-h-[500px] object-cover shadow-neomorph"
                />
              ) : (
                <img
                  src={defaultPoster}
                  alt={`Poster for ${eventStore.event.name}`}
                  className="rounded-3xl w-full max-h-[500px] object-cover shadow-neomorph"
                />
              )}
            </div>

            {/* Description container */}
            <div className="lg:w-1/2 w-full p-8 rounded-3xl bg-[#732D87] shadow-neomorph">
              <div className="flex flex-col items-center mb-6">
                <h1 className="font-semibold text-2xl text-white leading-tight text-center">
                  {eventStore.event && eventStore.event.name}
                </h1>
              </div>

              <div className="mb-4 text-white">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xl font-medium">Дата</p>
                  <p className="text-xl">
                    {eventStore.event &&
                      moment(eventStore.event.dateTime).format("YYYY-MM-DD")}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xl font-medium">Время</p>
                  <p className="text-xl">
                    {eventStore.event &&
                      moment(eventStore.event.dateTime).format("HH:mm")}
                  </p>
                </div>
              </div>

              <div className="text-white">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xl font-medium">Место</p>
                  <p className="text-xl">
                    {eventStore.event && eventStore.event.location}
                  </p>
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: eventStore.event && eventStore.event.description,
                }}
                className="text-base text-white text-lg mb-6 leading-relaxed"
              />

              <div className="mt-1">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="font-semibold px-6 py-3 bg-[#732D87] text-white rounded-2xl shadow-neomorph w-full sm:w-auto"
                >
                  Зарегистрироваться
                </button>
              </div>

              {eventStore.event && eventStore.event.registrations && (
                <div className="mt-3">
                  <div className="flex justify-center mb-3">
                    <h3 className="font-semibold text-2xl text-white leading-tight">
                      Участники
                    </h3>
                  </div>

                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {eventStore.event.registrations.map((participant) => (
                      <li
                        key={participant.registrationId}
                        className="flex justify-between items-center p-2 rounded-lg bg-[#9c4d99] text-white shadow-sm"
                      >
                        <span className="text-sm font-medium">
                          {participant.fullName}
                        </span>
                        {(isAdmin ||
                          participant.registrant.id === selectedUser) && (
                          <button
                            onClick={() =>
                              handleUnregister(participant.id, telegramId)
                            }
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isAdmin && (
                <div className="mt-8 flex flex-wrap justify-center items-center w-full gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="font-semibold px-6 py-3 bg-white text-[#732D87] rounded-2xl shadow-neomorph hover:bg-[#f4f4f4] transition-all w-full sm:w-auto"
                  >
                    Редактировать
                  </button>
                  {
                    <button
                      onClick={() => setIsDeleting(true)}
                      className="font-semibold ml-4 px-6 py-3 bg-red-600 text-white rounded-2xl shadow-neomorph hover:bg-red-700 transition-all w-full sm:w-auto"
                    >
                      Удалить событие
                    </button>
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Windows */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.8)] bg-opacity-50 z-50">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-2xl w-96 transition-all">
            <h2 className="text-xl font-medium text-[#732D87]">
              Зарегистрироваться
            </h2>
            <input
              type="text"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              placeholder="Введите ваше имя"
              className="mt-2 w-full p-3 border border-[#732D87] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#732D87] bg-white/40 placeholder-gray-700 text-black shadow-lg"
            />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gray-300/60 text-gray-800 rounded-2xl hover:bg-gray-300/80 transition-all"
              >
                Отменить
              </button>
              <button
                onClick={handleRegister}
                className="px-6 py-3 bg-[#732D87] text-white rounded-2xl hover:bg-[#732D87] transition-all"
              >
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && eventStore.event && (
        <EditEventModal
          isModalOpen={isEditing}
          handleModalClose={() => setIsEditing(false)}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleSaveEvent}
          event={eventStore.event}
          handleFileChange={handleFileChange}
        />
      )}

      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.8)] bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96 transition-all">
            <h2 className="text-xl font-medium text-[#732D87]">
              Удалить событие
            </h2>
            <p className="mt-2">Вы уверены, что хотите удалить это событие?</p>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-6 py-3 bg-gray-300 rounded-2xl"
              >
                Отменить
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default EventPage;

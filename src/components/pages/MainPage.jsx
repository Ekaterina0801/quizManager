
import EventsList from "../EventsList";
import Calendar from "../Calendar";
import React, { useState, useEffect } from 'react';
import TelegramAPI from "../../api/telegramApi";
import userStore from "../../store/userStore";
import teamStore from "../../store/teamStore";

export default function MainPage() {
  const [userId, setUserId] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [teamIdInput, setTeamIdInput] = useState("");
  const [viewMode, setViewMode] = useState("list"); 

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready(); 
    }
  }, []); 

  useEffect(() => {
    const getUserId = async () => {
      setIsLoading(true);
      const tgUser = window.Telegram?.WebApp.initDataUnsafe?.user;
      if (tgUser && tgUser.id) {
        setUserId(tgUser.id);

        try {
          // Используем store для получения информации о пользователе
          await userStore.fetchUserById(tgUser.id);
          const userTeams = userStore.users.length > 0 ? userStore.users[0].teams : [];
          
          if (userTeams.length > 0) {
            teamStore.teams = userTeams; // Используем store для команд
          } else {
            setShowTeamInput(true);
          }
        } catch (error) {
          console.error("Error fetching user teams:", error);
        }
      }
      setIsLoading(false);
    };

    getUserId();
  }, []);

  const handleSelectTeam = (selectedTeamId) => {
    setTeamId(selectedTeamId);
    console.log(`User ${userId} attached to team ${selectedTeamId}`);
  };

  const handleTeamIdSubmit = async () => {
    try {
      const response = await TelegramAPI.sendMessage(userId, `Вы ввели ID команды: ${teamIdInput}`);
      if (response) {
        setTeamId(teamIdInput);
        console.log('User attached to team:', teamIdInput);
      }
    } catch (error) {
      console.error('Error attaching user to team:', error);
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#732D87]">Мероприятия</h1>
            <button
              onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
              className="px-6 py-3 bg-[#732D87] text-white rounded-lg shadow-md hover:bg-[#5a1e67] transition-colors duration-300"
            >
              {viewMode === "list" ? "Показать календарь" : "Показать список"}
            </button>
          </div>

          <div className="mt-8">
            {/* Выбор команды или ввод ID команды */}
            {showTeamInput ? (
              <div className="space-y-4">
                <p>Введите ID команды:</p>
                <input
                  type="text"
                  value={teamIdInput}
                  onChange={(e) => setTeamIdInput(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                />
                <button
                  onClick={handleTeamIdSubmit}
                  className="px-6 py-3 bg-[#732D87] text-white rounded-lg shadow-md hover:bg-[#5a1e67] transition-colors duration-300"
                >
                  Прикрепить к команде
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">Выберите команду:</h2>
                <ul className="space-y-2">
                  {teamStore.teams.map((team) => (
                    <li
                      key={team.id}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#732D87] hover:text-white cursor-pointer"
                      onClick={() => handleSelectTeam(team.id)}
                    >
                      {team.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {teamId && (
            <div className="mt-8">
              {/* Заменяем компоненты в зависимости от выбранного режима */}
              {viewMode === "list" ? (
                <EventsList teamId={teamId} />
              ) : (
                <Calendar teamId={teamId} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

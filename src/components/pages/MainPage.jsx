import React, { useState, useEffect } from "react";
import userStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import teamStore from "../../store/teamStore";
import TeamAPI from "../../api/teamApi";
import { observer } from "mobx-react-lite";
import UserAPI from "../../api/userApi";
const MainPage = observer(() => {
  const [userId, setUserId] = useState(null);
  const [telegramId, setTelegramId] = useState("");
  const [userName, setUserName] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [teamIdInput, setTeamIdInput] = useState("");
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();


  
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user) {
      const user = tg.initDataUnsafe.user;
      setTelegramId(user.id.toString());
      console.log('telegram', user);
      setUserName(`${user.first_name} ${user.last_name || ""}`);
    } else {
      console.log('Telegram WebApp не инициализирован или нет данных пользователя');
    }
  }, []);

  useEffect(() => {
    if (!telegramId) {
      return;
    }

    const savedTeamId = sessionStorage.getItem("selectedTeamId");
    if (savedTeamId) {
      navigate("events", { state: { teamId: savedTeamId } });
      return;
    }

    const getUserId = async () => {
      setIsLoading(true);
      try {
        const user = await UserAPI.getUserByTelegramId(telegramId);
        console.log("user", user);
        if (user) {
          setUserId(user.id);
          userStore.saveToLocalStorage(user.id);

          const userTeams = await TeamAPI.getAllTeamsByUser(user.id);
          console.log("userTeams", userTeams);
          if (userTeams.length > 0) {
            setTeams(userTeams);
            setShowTeamInput(false);
          } else {
            setShowTeamInput(true);
          }
        } else {
          setShowTeamInput(true);
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
        setShowTeamInput(true);
      }
      setIsLoading(false);
    };

    getUserId();
  }, [telegramId, navigate]); 

  const handleSelectTeam = async (selectedTeamId) => {
    setTeamId(selectedTeamId);
    sessionStorage.setItem("selectedTeamId", selectedTeamId);
    console.log("Selected team ID:", selectedTeamId);

    await teamStore.saveSelectedTeamId(selectedTeamId);

    const userId = sessionStorage.getItem("selectedUser");
    if (userId) {
      await userStore.fetchUserById(JSON.parse(userId));
    }

    navigate("/events", { state: { teamId: selectedTeamId } });
  };

  const handleTeamIdSubmit = async () => {
    try {
      setTeamId(teamIdInput);
      const team = await TeamAPI.getTeamByInviteCode(teamIdInput);
      if (!team) {
        console.error("Команда не найдена");
        return;
      }

      await teamStore.addUserToTeam(team.id, telegramId, "USER");
      teamStore.saveSelectedTeamId(team.id);
      const user = await UserAPI.getUserByTelegramId(telegramId);
      userStore.saveToLocalStorage(user.id);

      navigate("/events", { state: { teamId: team.id } });
    } catch (error) {
      console.error("Ошибка привязки к команде:", error);
    }
  };

  const handleNewTeamClick = () => {
    setShowTeamInput(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-[#e0e5ec]">
      <div className="max-w-lg w-full bg-[#e0e5ec] shadow-neo rounded-2xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-[#732D87] mb-6">
          КвизМенеджер
        </h1>

        {isLoading ? (
          <p className="text-xl font-bold text-center text-[#732D87]">Загрузка...</p>
        ) : (
          <div>
            {!teamId ? (
              showTeamInput || teams.length === 0 ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#732D87]">
                    Введите ID команды
                  </h2>
                  <p className="text-[#732D87] mb-4">
                    Мы не смогли определить вашу команду. Введите ID вручную или
                    создайте новую команду.
                  </p>
                  <input
                    type="text"
                    value={teamIdInput}
                    onChange={(e) => setTeamIdInput(e.target.value)}
                    className="px-4 py-2 bg-[#e0e5ec] shadow-neo-inner rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-[#6d5dfc]"
                    placeholder="Введите ID..."
                  />
                  <button
                    onClick={handleTeamIdSubmit}
                    className="mt-4 px-6 py-3 bg-[#732D87] text-white rounded-lg shadow-neo hover:bg-[#5b4dc8] transition transform hover:scale-105"
                  >
                    Присоединиться
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-[#732D87] text-center mb-4">
                    Выберите команду
                  </h2>
                  <p className="text-[#732D87] text-center mb-6">
                    Вы состоите в нескольких командах. Выберите, в какую команду
                    хотите перейти:
                  </p>
                  <ul className="space-y-3">
                    {teams.map((team) => (
                      <li
                        key={team.id}
                        className="px-4 py-3 bg-[#e0e5ec] shadow-neo rounded-lg hover:bg-[#732D87] hover:text-white cursor-pointer transition transform hover:scale-105 flex items-center justify-between"
                        onClick={() => handleSelectTeam(team.id)}
                      >
                        <span className="font-medium">{team.name}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleNewTeamClick}
                    className="mt-6 w-full px-6 py-3 bg-[#732D87] text-white font-semibold rounded-lg shadow-neo hover:bg-[#5b4dc8] transition transform hover:scale-105"
                  >
                    Подключить новую команду
                  </button>
                </div>
              )
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});

export default MainPage;


/* const MainPage = observer(() => {
  const [userId, setUserId] = useState(null);
  const [telegramId, setTelegramId] = useState("");
  const [userName, setUserName] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [teamIdInput, setTeamIdInput] = useState("");
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramId(user.id.toString());
        setUserName(`${user.first_name} ${user.last_name || ""}`);
      }
    }
  }, []);

  useEffect(() => {
    const savedTeamId = sessionStorage.getItem("selectedTeamId");
    if (savedTeamId) {
      navigate("/events", { state: { teamId: savedTeamId } });
      return;
    }

    const getUserId = async () => {
      if (!telegramId) return; 

      setIsLoading(true);
      try {
        const user = await UserAPI.getUserByTelegramId(telegramId);
        console.log("user", user);
        if (user) {
          setUserId(user.id);
          userStore.saveToLocalStorage(user.id);

          const userTeams = await TeamAPI.getAllTeamsByUser(user.id);
          console.log("userTeams", userTeams);
          if (userTeams.length > 0) {
            setTeams(userTeams);
            setShowTeamInput(false);
          } else {
            setShowTeamInput(true);
          }
        } else {
          setShowTeamInput(true);
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
        setShowTeamInput(true);
      }
      setIsLoading(false);
    };

    getUserId();
  }, [navigate, telegramId]);

  const handleSelectTeam = async (selectedTeamId) => {
    setTeamId(selectedTeamId);
    sessionStorage.setItem("selectedTeamId", selectedTeamId);
    console.log("Selected team ID:", selectedTeamId);

    await teamStore.saveSelectedTeamId(selectedTeamId);

    const userId = sessionStorage.getItem("selectedUser");
    if (userId) {
      await userStore.fetchUserById(JSON.parse(userId));
    }

    navigate("/events", { state: { teamId: selectedTeamId } });
  };

  const handleTeamIdSubmit = async () => {
    try {
      setTeamId(teamIdInput);
      const team = await TeamAPI.getTeamByInviteCode(teamIdInput);
      if (!team) {
        console.error("Команда не найдена");
        return;
      }

      await teamStore.addUserToTeam(team.id, telegramId, "USER");
      teamStore.saveSelectedTeamId(team.id);
      const user = await UserAPI.getUserByTelegramId(telegramId);
      userStore.saveToLocalStorage(user.id);

      navigate("/events", { state: { teamId: team.id } });
    } catch (error) {
      console.error("Ошибка привязки к команде:", error);
    }
  };

  const handleNewTeamClick = () => {
    setShowTeamInput(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-[#e0e5ec]">
      <div className="max-w-lg w-full bg-[#e0e5ec] shadow-neo rounded-2xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-[#732D87] mb-6">
          КвизМенеджер
        </h1>

        {isLoading ? (
          <p className="text-xl font-bold text-center text-[#732D87]">Загрузка...</p>
        ) : (
          <div>
            {!teamId ? (
              showTeamInput || teams.length === 0 ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#732D87]">
                    Введите ID команды
                  </h2>
                  <p className="text-[#732D87] mb-4">
                    Мы не смогли определить вашу команду. Введите ID вручную или
                    создайте новую команду.
                    Телеграм айди {telegramId}
                  </p>
                
                  <input
                    type="text"
                    value={teamIdInput}
                    onChange={(e) => setTeamIdInput(e.target.value)}
                    className="px-4 py-2 bg-[#e0e5ec] shadow-neo-inner rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-[#6d5dfc]"
                    placeholder="Введите ID..."
                  />
                  <button
                    onClick={handleTeamIdSubmit}
                    className="mt-4 px-6 py-3 bg-[#732D87] text-white rounded-lg shadow-neo hover:bg-[#5b4dc8] transition transform hover:scale-105"
                  >
                    Присоединиться
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-[#732D87] text-center mb-4">
                    Выберите команду
                  </h2>
                  <p className="text-[#732D87] text-center mb-6">
                    Вы состоите в нескольких командах. Выберите, в какую команду
                    хотите перейти:
                  </p>
                  <ul className="space-y-3">
                    {teams.map((team) => (
                      <li
                        key={team.id}
                        className="px-4 py-3 bg-[#e0e5ec] shadow-neo rounded-lg hover:bg-[#732D87] hover:text-white cursor-pointer transition transform hover:scale-105 flex items-center justify-between"
                        onClick={() => handleSelectTeam(team.id)}
                      >
                        <span className="font-medium">{team.name}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleNewTeamClick}
                    className="mt-6 w-full px-6 py-3 bg-[#732D87] text-white font-semibold rounded-lg shadow-neo hover:bg-[#5b4dc8] transition transform hover:scale-105"
                  >
                    Подключить новую команду
                  </button>
                </div>
              )
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});

export default MainPage; */
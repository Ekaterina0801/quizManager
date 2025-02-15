import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import notificationStore from "../../store/notificationStore";
import { useParams } from "react-router-dom";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import TopBar from "../TopBar";
import teamStore from "../../store/teamStore";
const NotificationSettingsPage = observer(() => {
    const { selectedTeamId } = teamStore;
    const [settings, setSettings] = useState({
      registrationNotificationEnabled: true,
      unregisterNotificationEnabled: true,
      eventReminderEnabled: true,
      registrationReminderHoursBeforeEvent: 24,
    });
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      const fetchSettings = async () => {
        if (!selectedTeamId) return;
        setIsLoading(true);
        try {
          await notificationStore.fetchNotificationSettings(selectedTeamId);
          const storedSettings = notificationStore.notifications[selectedTeamId];
          if (storedSettings) {
            setSettings(storedSettings);
          }
        } catch (error) {
          console.error("Ошибка при загрузке настроек:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchSettings();
    }, [selectedTeamId]);
  
    const handleChange = (name, value) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    };
  
    const handleSave = async () => {
      if (!selectedTeamId) return;
      setIsLoading(true);
      try {
        await notificationStore.updateNotificationSettings(selectedTeamId, settings);
        alert("Настройки успешно сохранены!");
      } catch (error) {
        console.error("Ошибка при сохранении настроек:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#e4effc] flex items-center justify-center z-50">
            <div className="animate-spin rounded-full border-t-4 border-b-4 border-[#732D87] w-16 h-16">

            </div>
        </div>
        );
      }
      
  
    return (
      <div className="min-h-screen flex flex-col bg-[#e4effc]">
        <TopBar title="Настройки" showBackButton={true} showSettingsIcon={false} />
  
        <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-[#f8fbff] to-[#e4effc] p-10 rounded-3xl shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#ffffff] mt-6">
          
          {/* Регистрация */}
          <div className="flex items-center justify-between mb-6 px-4 py-3 bg-[#f0f5fc] rounded-xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
            <span className="text-lg font-medium text-[#732D87]">Уведомление при регистрации</span>
            <Switch
              checked={settings.registrationNotificationEnabled}
              onChange={(value) => handleChange("registrationNotificationEnabled", value)}
              offColor="#d1d5db"
              onColor="#732D87"
              className="rounded-lg shadow-md hover:scale-110 transition-transform duration-300"
            />
          </div>
  
          {/* Отмена регистрации */}
          <div className="flex items-center justify-between mb-6 px-4 py-3 bg-[#f0f5fc] rounded-xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
            <span className="text-lg font-medium text-[#732D87]">Уведомление при отмене регистрации</span>
            <Switch
              checked={settings.unregisterNotificationEnabled}
              onChange={(value) => handleChange("unregisterNotificationEnabled", value)}
              offColor="#d1d5db"
              onColor="#732D87"
              className="rounded-lg shadow-md hover:scale-110 transition-transform duration-300"
            />
          </div>
  
          {/* Напоминание */}
          <div className="flex items-center justify-between mb-6 px-4 py-3 bg-[#f0f5fc] rounded-xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
            <span className="text-lg font-medium text-[#732D87]">Напоминание о мероприятии</span>
            <Switch
              checked={settings.eventReminderEnabled}
              onChange={(value) => handleChange("eventReminderEnabled", value)}
              offColor="#d1d5db"
              onColor="#732D87"
              className="rounded-lg shadow-md hover:scale-110 transition-transform duration-300"
            />
          </div>
  
          {/* Время напоминания */}
          <div className="mb-8">
            <label className="block text-lg font-medium mb-2 text-[#732D87]">Время напоминания (часы до мероприятия):</label>
            <input
              type="number"
              value={settings.registrationReminderHoursBeforeEvent}
              onChange={(e) => handleChange("registrationReminderHoursBeforeEvent", Number(e.target.value))}
              min="1"
              className="border-none rounded-lg p-3 w-full text-lg bg-[#f0f5fc] text-[#6f7d97] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#732D87]"
            />
          </div>
  
          {/* Кнопка сохранения */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-[#f0f5fc] font-semibold text-[#732D87] text-lg rounded-xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] hover:shadow-[2px_2px_6px_#cbd5e1,-2px_-2px_6px_#ffffff] active:shadow-inner hover:scale-105 transition-all duration-300"
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    );
  });
  
  export default NotificationSettingsPage;
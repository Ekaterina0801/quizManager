import { Card, CardContent, CardMedia, Typography, CardHeader } from "@mui/material";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import EventModal from "./EventModal";
import { observer } from "mobx-react-lite";
import eventStore from "../store/eventStore";

const Calendar = observer(() => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: "",
    time: "",
    title: "",
    location: "",
    description: "",
    posterUrl: "",
  });

  useEffect(() => {
    // Загрузка событий для выбранной команды
    eventStore.fetchEventsForTeam();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else if (direction === "next") {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

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
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setNewEvent({ ...newEvent, posterUrl: fileUrl });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    eventStore.createEvent(newEvent);
    setIsModalOpen(false);
  };

  const generateDays = () => {
    const today = new Date(selectedYear, selectedMonth, 1);
    const firstDayOfMonth = today.getDay();
    const lastDateOfMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const totalDays = firstDayOfMonth + lastDateOfMonth;
    const calendarDays = [];

    for (let i = 0; i < totalDays; i++) {
      if (i < firstDayOfMonth) {
        calendarDays.push(null);
      } else {
        const day = i - firstDayOfMonth + 1;
        const event = eventStore.events.find(
          (event) =>
            new Date(event.date).getDate() === day &&
            new Date(event.date).getMonth() === selectedMonth
        );
        calendarDays.push({ day, event });
      }
    }

    return calendarDays;
  };

  return (
    <div className="container mx-auto p-2">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => handleMonthChange("prev")}
          className="text-xl font-bold text-[#732D87] hover:text-[#5a1e67] transition-colors duration-300"
        >
          {"<"}
        </button>
        <h2 className="text-2xl font-semibold text-[#732D87]">
          {monthNames[selectedMonth]} {selectedYear}
        </h2>
        <button
          onClick={() => handleMonthChange("next")}
          className="text-xl font-bold text-[#732D87] hover:text-[#5a1e67] transition-colors duration-300"
        >
          {">"}
        </button>
      </div>

      {/* Названия дней недели */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-[#732D87] mb-5">
        {weekDays.map((day, index) => (
          <div key={index} className="font-bold">{day}</div>
        ))}
      </div>

      {/* Дни месяца */}
      <div className="grid grid-cols-7 gap-4">
        {generateDays().map((dayData, index) => (
          <div key={index} className="relative">
            {/* Число дня */}
            {dayData && (
              <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-center font-bold text-xl text-[#732D87] z-10">
                {dayData.day}
              </div>
            )}
            {/* Контейнер для события */}
            <div
              className={`h-45 mb-5 mt-2 border rounded-lg overflow-hidden ${dayData ? 'cursor-pointer' : 'bg-gray-200'}`}
            >
              {dayData && (
                <div className="flex flex-col h-full pt-0">
                  {dayData.event ? (
                    <>
                      {dayData.event.posterUrl && (
                        <div className="relative w-full h-24 bg-gray-200">
                          <img
                            src={dayData.event.posterUrl}
                            alt={dayData.event.title}
                            className="object-cover w-full h-full rounded-t-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-2 text-sm overflow-hidden">
                        <p className="text-[#732D87]">{dayData.event.time}</p>
                        <p className="text-gray-500 truncate">{dayData.event.title}</p>
                        <p className="text-gray-500 truncate">{dayData.event.location}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400"></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка для добавления события */}
      <button
        onClick={handleAddEvent}
        className="mt-4 w-full py-2 bg-[#732D87] text-white font-semibold rounded-md hover:bg-[#5a1e67] transition-colors duration-300"
      >
        Добавить событие
      </button>

      {/* Модальное окно для добавления события */}
      <EventModal
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        newEvent={newEvent}
        handleFileChange={handleFileChange}
      />
    </div>
  );
});

export default Calendar;

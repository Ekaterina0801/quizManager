
import { useState, useEffect } from "react";

import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';

const Calendar = observer(({ events }) => {
  const navigate = useNavigate(); 
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const generateDays = () => {
    const today = new Date(selectedYear, selectedMonth, 1);
    const firstDayOfMonth = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const lastDateOfMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();
    const totalDays = firstDayOfMonth + lastDateOfMonth;
    const calendarDays = [];

    for (let i = 0; i < totalDays; i++) {
      if (i < firstDayOfMonth) {
        calendarDays.push(null);
      } else {
        const day = i - firstDayOfMonth + 1;
        const dayEvents = events.filter((event) => {
          const eventDate = new Date(event.dateTime);
          return (
            eventDate.getDate() === day &&
            eventDate.getMonth() === selectedMonth &&
            eventDate.getFullYear() === selectedYear
          );
        });

        calendarDays.push({ day, events: dayEvents });
      }
    }

    return calendarDays;
  };

  return (
    <div className="container mx-auto p-0 w-full px-2 sm:px-6 py-4 sm:py-16 rounded-2xl bg-gradient-to-br from-[#e4effc] to-[#cbd5e1] shadow-lg">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => handleMonthChange("prev")}
          className="text-xl sm:text-2xl font-bold text-[#732D87] hover:text-[#5a1e67] transition-transform duration-300 shadow-md rounded-full p-2 hover:scale-105 bg-gradient-to-br from-[#e4effc] to-[#cbd5e1]"
        >
          {"<"}
        </button>
        <h2 className="text-xl sm:text-3xl font-semibold text-[#732D87]">
          {monthNames[selectedMonth]} {selectedYear}
        </h2>
        <button
          onClick={() => handleMonthChange("next")}
          className="text-xl sm:text-2xl font-bold text-[#732D87] hover:text-[#5a1e67] transition-transform duration-300 shadow-md rounded-full p-2 hover:scale-105 bg-gradient-to-br from-[#e4effc] to-[#cbd5e1]"
        >
          {">"}
        </button>
      </div>

      {/* Названия дней недели */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-semibold text-[#732D87] mb-2 sm:mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="font-bold">
            {day}
          </div>
        ))}
      </div>

      {/* Дни месяца */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 sm:gap-3 min-w-[300px]">
          {generateDays().map((dayData, index) => (
            <div key={index} className="relative">
              {dayData && (
                <div className="absolute top-[-6px] sm:top-[-12px] left-1/2 transform -translate-x-1/2 text-center font-semibold text-xs sm:text-sm text-[#732D87] z-10">
                  {dayData.day}
                </div>
              )}

              <div
                className={`h-28 sm:h-40 mb-2 sm:mb-3 mt-1 sm:mt-2 rounded-lg overflow-hidden ${
                  dayData ? "cursor-pointer" : "bg-gray-200"
                } ${
                  dayData?.events?.length > 0 ? "bg-[#732D87] text-white" : ""
                }`}
                style={{
                  boxShadow:
                    dayData?.events?.length > 0
                      ? "4px 4px 8px rgba(0, 0, 0, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.7)"
                      : "3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.5)",
                  background:
                    dayData?.events?.length > 0
                      ? "linear-gradient(145deg, #732D87, #5a1e67)"
                      : "linear-gradient(145deg, #e4effc, #cbd5e1)",
                }}
              >
                {dayData && dayData.events.length > 0 ? (
                  <div className="flex flex-col h-full pt-0 overflow-y-auto">
                    {dayData.events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="p-1 sm:p-2 text-[10px] sm:text-[12px]"  
                      >
                        <p className="text-white font-semibold text-[10px] sm:text-[12px]">
                          {new Date(event.dateTime).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p
                          className="text-white font-medium mt-1 sm:mt-2 cursor-pointer break-words whitespace-normal hover:underline text-[10px] sm:text-[12px]" 
                          onClick={() => navigate(`/events/${event.id}`)} 
                        >
                          {event.name}
                        </p>
                        <p className="text-white mt-1 sm:mt-2 break-words whitespace-normal text-[10px] sm:text-[12px]">  
                          {event.location}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-[#732D87] font-semibold text-[10px] sm:text-[12px]">
                      Нет события
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Calendar;

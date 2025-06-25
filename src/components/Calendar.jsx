import { observer } from "mobx-react-lite";
import React, { useState } from "react";

const Calendar = ({ events }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

  const formatDate = (date) => {
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const changeMonth = (dir) => {
    if (dir === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    } else {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
    }
  };

  const getDays = () => {
    const first = new Date(year, month, 1);
    const startDay = (first.getDay() + 6) % 7;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const total = Math.ceil((startDay + lastDay) / 7) * 7;

    return Array.from({ length: total }, (_, i) => {
      const day = i - startDay + 1;
      if (i < startDay || day > lastDay) return null;

      const dayEvents = events.filter((ev) => {
        const eventDate = new Date(ev.dateTime);
        return (
          eventDate.getFullYear() === year &&
          eventDate.getMonth() === month &&
          eventDate.getDate() === day
        );
      });

      return {
        date: new Date(year, month, day),
        day,
        events: dayEvents,
      };
    });
  };

  const days = getDays();

  const handleDayClick = (day) => {
    if (day && day.events.length > 0) {
      setSelectedDay(day);
    }
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 relative">
      {/* Заголовок календаря */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => changeMonth("prev")}
          className="text-xl px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-full"
        >
          ‹
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => changeMonth("next")}
          className="text-xl px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-full"
        >
          ›
        </button>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs sm:text-sm">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className={`py-2 ${
              idx >= 5 ? "bg-pink-50" : "bg-pink-100"
            } rounded`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Ячейки дней */}
      <div className="grid grid-cols-7 gap-1 mt-1">
        {days.map((item, idx) => (
          <div
            key={idx}
            className={`
              min-h-[80px] sm:min-h-[120px] 
              border border-pink-200 rounded
              ${
                item
                  ? item.events.length > 0
                    ? "bg-white cursor-pointer"
                    : "bg-white"
                  : "bg-gray-100 opacity-70"
              }
              relative overflow-hidden
            `}
            onClick={() => handleDayClick(item)}
          >
            {item ? (
              <>
                {/* Число дня */}
                <div className="absolute top-1 left-1 text-[10px] sm:text-xs font-bold bg-white px-1.5 py-0.5 rounded z-10">
                  {item.day}
                </div>

                {/* События */}
                <div className="pt-5 pb-1 px-1 h-full">
                  {item.events.length === 1 ? (
                    <div
                      className="absolute inset-0 w-full h-full"
                      onClick={(e) => handleEventClick(item.events[0], e)}
                    >
                      {item.events[0].posterUrl && (
                        <img
                          src={item.events[0].posterUrl}
                          alt={item.events[0].name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                        <div className="text-[10px] sm:text-xs font-bold text-white truncate">
                          {item.events[0].name}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-white">
                          {(() => {
                            const date = new Date(item.events[0].dateTime);
                            const hours = date
                              .getHours()
                              .toString()
                              .padStart(2, "0");
                            const minutes = date
                              .getMinutes()
                              .toString()
                              .padStart(2, "0");
                            return `${hours}:${minutes}`;
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : item.events.length === 2 ? (
                    <div className="h-full flex flex-col gap-0.5">
                      {item.events
                        .slice() 
                        .sort(
                          (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
                        )
                        .map((ev, i) => (
                          <div
                            key={ev.id}
                            className={`flex-1 relative rounded-sm overflow-hidden cursor-pointer ${
                              i === 0 ? "mb-0.5" : "mt-0.5"
                            }`}
                            onClick={(e) => handleEventClick(ev, e)}
                          >
                            {ev.posterUrl ? (
                              <img
                                src={ev.posterUrl}
                                alt={ev.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-pink-500 flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold text-center px-1">
                                  {ev.name}
                                </span>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                              <div className="text-[8px] sm:text-[10px] font-bold text-white truncate">
                                {ev.name}
                              </div>
                              <div className="text-[8px] sm:text-[10px] text-white">
                                {(() => {
                                  const date = new Date(ev.dateTime);
                                  const hours = date
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0");
                                  const minutes = date
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0");
                                  return `${hours}:${minutes}`;
                                })()}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto no-scrollbar">
                      {item.events
                        .slice() // создаём копию массива, чтобы не мутировать оригинал
                        .sort(
                          (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
                        ) // сортировка по времени
                        .map((ev, i) => (
                          <div
                            key={ev.id}
                            className="mb-0.5 last:mb-0 rounded-sm overflow-hidden shadow-xs cursor-pointer"
                            onClick={(e) => handleEventClick(ev, e)}
                          >
                            <div
                              className={`
            relative h-5 sm:h-7 
            ${ev.posterUrl ? "" : "bg-pink-500"}
            flex items-center justify-center
          `}
                            >
                              {ev.posterUrl && (
                                <img
                                  src={ev.posterUrl}
                                  alt={ev.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                              <div className="relative z-10 px-1 w-full">
                                <div className="text-[8px] sm:text-xs font-bold text-white truncate">
                                  {ev.name}
                                </div>
                                <div className="text-[8px] sm:text-[10px] text-white">
                                  {(() => {
                                    const date = new Date(ev.dateTime);
                                    const hours = date
                                      .getHours()
                                      .toString()
                                      .padStart(2, "0");
                                    const minutes = date
                                      .getMinutes()
                                      .toString()
                                      .padStart(2, "0");
                                    return `${hours}:${minutes}`;
                                  })()}
                                </div>
                              </div>
                            </div>
                            {ev.name && (
                              <div className="bg-white p-0.5 text-[7px] sm:text-[8px] text-gray-700 font-medium truncate">
                                {ev.name}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>

      {/* Модальное окно для дня */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="p-3 sm:p-4 border-b">
              <h3 className="text-lg sm:text-xl font-bold">
                События {formatDate(selectedDay.date)}
              </h3>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {selectedDay.events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 sm:p-4 border-b cursor-pointer hover:bg-pink-50"
                  onClick={() => {
                    setSelectedDay(null);
                    setSelectedEvent(event);
                  }}
                >
                  <div className="flex items-start">
                    {event.posterUrl && (
                      <img
                        src={event.posterUrl}
                        alt={event.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-sm sm:text-base">
                        {event.name}
                      </h4>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        <div className="text-[8px] sm:text-[10px] text-white">
                          {(() => {
                            const date = new Date(item.events[0].dateTime);
                            const hours = date
                              .getHours()
                              .toString()
                              .padStart(2, "0");
                            const minutes = date
                              .getMinutes()
                              .toString()
                              .padStart(2, "0");
                            return `${hours}:${minutes}`;
                          })()}
                        </div>
                        <div>Место: {event.location}</div>
                        {event.name && <div>Квиз: {event.name}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 sm:p-4 flex justify-end">
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 bg-pink-500 text-white text-sm rounded hover:bg-pink-600"
                onClick={() => setSelectedDay(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для события */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="p-3 sm:p-4 border-b">
              <h3 className="text-lg sm:text-xl font-bold">
                {selectedEvent.name}
              </h3>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto max-h-[60vh]">
              {selectedEvent.posterUrl && (
                <img
                  src={selectedEvent.posterUrl}
                  alt={selectedEvent.name}
                  className="w-full h-40 sm:h-48 object-cover rounded mb-3 sm:mb-4"
                />
              )}

              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div>
                  <strong>Дата:</strong>{" "}
                  {formatDate(new Date(selectedEvent.dateTime))}
                </div>
                <div>
                  <strong>Время:</strong> {selectedEvent.time}
                </div>
                <div>
                  <strong>Место:</strong> {selectedEvent.location}
                </div>
                {selectedEvent.name && (
                  <div>
                    <strong>Квиз:</strong> {selectedEvent.name}
                  </div>
                )}
                {selectedEvent.description && (
                  <div>
                    <strong>Описание:</strong> {selectedEvent.description}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between gap-2 border-t">
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedDay({
                    date: new Date(selectedEvent.dateTime),
                    events: [selectedEvent],
                  });
                }}
              >
                Назад к событиям
              </button>
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 bg-pink-500 text-white text-sm rounded hover:bg-pink-600"
                onClick={() => {
                  window.location.href = `/events/${selectedEvent.id}`;
                }}
              >
                Перейти к квизу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

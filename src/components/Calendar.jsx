import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, Link } from "react-router-dom";

const Calendar = observer(({ events }) => {
  const navigate = useNavigate();
  const today    = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear]   = useState(today.getFullYear());
  const [modalEvents, setModalEvents] = useState(null);

  const monthNames = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
  const weekDays   = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

  const changeMonth = dir => {
    if (dir === "prev") {
      if (month === 0) { setMonth(11); setYear(y => y - 1); }
      else setMonth(m => m - 1);
    } else {
      if (month === 11) { setMonth(0); setYear(y => y + 1); }
      else setMonth(m => m + 1);
    }
  };

  const days = (() => {
    const first  = new Date(year, month, 1);
    const offset = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const last   = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: offset + last }, (_, i) => {
      if (i < offset) return null;
      const d = i - offset + 1;
      const dayEvents = events.filter(ev => {
        const dt = new Date(ev.dateTime);
        return dt.getFullYear() === year &&
               dt.getMonth()   === month &&
               dt.getDate()    === d;
      });
      return { day: d, events: dayEvents };
    });
  })();

  const openModal  = evs => setModalEvents(evs);
  const closeModal = () => setModalEvents(null);

  const initials = str =>
    str
      .split(" ")
      .map(w => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mx-auto max-w-full sm:max-w-md md:max-w-3xl lg:max-w-6xl">
        <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-pink-300"/>
        <div className="flex items-center justify-between p-4">
          <button onClick={()=>changeMonth("prev")} className="p-2 rounded-full bg-purple-50 hover:bg-purple-100">‹</button>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{monthNames[month]} {year}</h2>
          <button onClick={()=>changeMonth("next")} className="p-2 rounded-full bg-purple-50 hover:bg-purple-100">›</button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-600 border-b">
          {weekDays.map((wd,i)=> <div key={i} className={i>=5?"text-pink-500":""}>{wd}</div>)}
        </div>
        <div className="overflow-x-auto sm:overflow-x-visible">
          <div className="inline-grid grid-cols-7 gap-2 p-3 min-w-[600px]">
            {days.map((item,idx) => (
              <div key={idx} className="flex flex-col">
                {item ? (
                  <div
                    onClick={() => item.events.length && openModal(item.events)}
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                  >
                    {item.events[0]?.posterUrl ? (
                      <img src={item.events[0].posterUrl}
                           className="w-full h-48 object-cover"
                           alt="" />
                    ) : (
                      <div className="w-full h-48 bg-purple-200" />
                    )}
                    <div className="absolute top-1 left-1 bg-white px-2 py-0.5 rounded text-xs font-medium shadow">
                      {item.day}
                    </div>
                  </div>
                ) : (
                  <div className="h-24 bg-purple-50 rounded-lg"/>
                )}
                {item && item.events.length > 0 && (
                  <ul className="mt-1 text-xs text-gray-700">
                    {item.events.slice(0,2).map(ev => (
                      <li key={ev.id} className="truncate">
                        {ev.name}
                      </li>
                    ))}
                    {item.events.length > 2 && <li className="text-gray-500">+{item.events.length-2} ещё</li>}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalEvents && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 bg-transparent"
    onClick={closeModal}
  >
    <div
      className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
      onClick={e => e.stopPropagation()}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">События дня</h3>
      <ul className="space-y-4">
        {modalEvents.map(ev => (
          <li key={ev.id} className="flex">
            <Link to={`/events/${ev.id}`} className="flex-shrink-0 mr-4">
              {ev.posterUrl ? (
                <img
                  src={ev.posterUrl}
                  alt=""
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-purple-300 rounded flex items-center justify-center">
                  <span className="text-white font-bold">
                    {ev.name
                      .split(" ")
                      .map(w => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </Link>
            <div className="flex-1">
              <Link
                to={`/events/${ev.id}`}
                className="block font-medium text-gray-800 hover:text-purple-600"
              >
                {ev.name}
              </Link>
              <div className="text-gray-500 text-sm">
                {new Date(ev.dateTime).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={closeModal}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Закрыть
      </button>
    </div>
  </div>
)}


    </>
  );
});

export default Calendar;

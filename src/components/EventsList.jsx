

import defaultPoster from "../assets/defaultPoster.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function EventsList({ events }) {
  const navigate = useNavigate();
  const [showPast, setShowPast] = useState(false);

  if (!events || events.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        Нет мероприятий для этой команды
      </div>
    );
  }

  const now = Date.now();
  const upcoming = events
    .filter((e) => e.dateTime && new Date(e.dateTime).getTime() > now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  const past = events
    .filter((e) => e.dateTime && new Date(e.dateTime).getTime() <= now)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const groupByMonth = (list) =>
    list.reduce((acc, ev) => {
      const key = new Date(ev.dateTime).toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      });
      (acc[key] = acc[key] || []).push(ev);
      return acc;
    }, {});

  const upGroups = groupByMonth(upcoming);
  const pastGroups = groupByMonth(past);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Мероприятия
        </h2>

        <div className="flex justify-center mb-12">
          <label className="inline-flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              checked={showPast}
              onChange={() => setShowPast((f) => !f)}
              className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-400"
            />
            <span className="text-lg">Показать прошедшие</span>
          </label>
        </div>

        {Object.keys(upGroups).length > 0 && (
          <EventsSection
            title="Предстоящие"
            groups={upGroups}
            navigate={navigate}
          />
        )}

        {showPast && Object.keys(pastGroups).length > 0 && (
          <EventsSection title="Прошедшие" groups={pastGroups} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

function EventsSection({ title, groups, navigate }) {
  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h3>
      {Object.entries(groups).map(([month, evs]) => (
        <div key={month} className="mb-10">
          <h4 className="text-xl text-gray-600 mb-4">{month}</h4>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {evs.map((e) => (
              <EventCard key={e.id} event={e} navigate={navigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function EventCard({ event, navigate }) {
  const dateObj = event.dateTime ? new Date(event.dateTime) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  const timeStr = dateObj
    ? dateObj.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="
        relative
        bg-white
        rounded-2xl
        overflow-hidden
        cursor-pointer
        group
        shadow-md
        hover:shadow-2xl
        transition-shadow
        border
        border-transparent
        hover:border-purple-500
      "
    >
      <div className="h-64 bg-gray-100 relative">
        {event.posterUrl ? (
          <img
            src={event.posterUrl}
            alt={event.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <img
            src={defaultPoster}
            alt="Постер отсутствует"
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white flex items-center space-x-3 text-sm">
          <div className="px-2 py-1 bg-purple-600 bg-opacity-80 rounded">
            {dateStr}
          </div>
          <div className="px-2 py-1 bg-purple-600 bg-opacity-80 rounded">
            {timeStr}
          </div>
        </div>
      </div>

      <div className="p-6 min-h-[14rem] flex flex-col bg-purple-50">
        <h5 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
          {event.name}
        </h5>
        <p className="text-gray-700 line-clamp-4 mb-6">
          {event.description || "Описание отсутствует"}
        </p>
        <div className="mt-auto flex justify-end">
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="
              inline-flex items-center space-x-2
              text-purple-600 hover:text-purple-800
              font-semibold
            "
          >
            <span>Подробнее</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

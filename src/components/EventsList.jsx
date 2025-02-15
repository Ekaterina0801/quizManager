import { useEffect, useState } from "react";
import EventAPI from "../api/eventApi";
import eventStore from "../store/eventStore";
import teamStore from "../store/teamStore";
import { useNavigate } from "react-router-dom";
import defaultPoster from "../assets/defaultPoster.jpg";
export default function EventsList({ events }) {
  const navigate = useNavigate();
  const [showPastEvents, setShowPastEvents] = useState(true);

  if (!events || events.length === 0) {
    return (
      <div className="text-gray-500 text-center">
        Нет мероприятий для этой команды
      </div>
    );
  }

  const filterAndSortEvents = (events) => {
    const now = new Date();

    const upcomingEvents = events
      .filter((event) => event.dateTime && new Date(event.dateTime) > now)
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    const pastEvents = events
      .filter((event) => event.dateTime && new Date(event.dateTime) <= now)
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    return { upcomingEvents, pastEvents };
  };

  const groupEventsByMonth = (events) => {
    return events.reduce((acc, event) => {
      const date = new Date(event.dateTime);
      const monthYear = date.toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(event);
      return acc;
    }, {});
  };

  const { upcomingEvents, pastEvents } = filterAndSortEvents(events);
  const groupedUpcomingEvents = groupEventsByMonth(upcomingEvents);
  const groupedPastEvents = groupEventsByMonth(pastEvents);

  return (
    <div className="flex justify-center">
      <div className="max-w-7xl w-full px-6 py-16 rounded-2xl bg-gradient-to-br from-[#e4effc] to-[#cbd5e1] shadow-[inset_4px_4px_8px_#b0bec5,inset_-4px_-4px_8px_#ffffff]">
        <h2 className="text-3xl font-bold tracking-tight text-[#732D87] text-center">
          Мероприятия
        </h2>

        {/* Переключатель для отображения прошедших мероприятий */}
        <div className="flex justify-center mt-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPastEvents}
              onChange={() => setShowPastEvents(!showPastEvents)}
              className="form-checkbox h-5 w-5 text-[#732D87] rounded-lg focus:ring-[#732D87]"
            />
            <span className="text-lg text-[#732D87]">
              Показать прошедшие мероприятия
            </span>
          </label>
        </div>

        {/* Предстоящие мероприятия */}
        {Object.keys(groupedUpcomingEvents).length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-[#732D87] mb-6">
              Предстоящие мероприятия
            </h3>
            {Object.entries(groupedUpcomingEvents).map(
              ([monthYear, events]) => (
                <div key={monthYear} className="mb-8">
                  <h4 className="text-xl font-semibold text-[#732D87] mb-4">
                    {monthYear}
                  </h4>
                  <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-12">
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Прошедшие мероприятия */}
        {showPastEvents && Object.keys(groupedPastEvents).length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-[#732D87] mb-6">
              Прошедшие мероприятия
            </h3>
            {Object.entries(groupedPastEvents).map(([monthYear, events]) => (
              <div key={monthYear} className="mb-8">
                <h4 className="text-xl font-semibold text-[#732D87] mb-4">
                  {monthYear}
                </h4>
                <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-12">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      navigate={navigate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Компонент карточки мероприятия
const EventCard = ({ event, navigate }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#e4effc] to-[#cbd5e1] shadow-[6px_6px_12px_#b0bec5,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#b0bec5,-4px_-4px_8px_#ffffff] transition-all duration-300">
      {event.posterUrl ? (
        <img
          alt={event.name}
          src={event.posterUrl}
          className="aspect-[3/4] w-full rounded-xl shadow-[inset_4px_4px_8px_#b0bec5,inset_-4px_-4px_8px_#ffffff] object-cover group-hover:opacity-80 sm:h-96"
        />
      ) : (
        <img
          src={defaultPoster}
          alt={`Poster for event`}
          className="rounded-3xl w-full max-h-[500px] object-cover shadow-neomorph"
        />
      )}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-xl font-semibold text-[#732D87]">{event.name}</h3>
        <p className="text-sm text-[#732D87]">
          {event.dateTime
            ? new Date(event.dateTime).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Дата не указана"}
        </p>
        <p className="text-sm text-[#732D87]">
          {event.description || "Описание отсутствует"}
        </p>
        <button
          onClick={() => navigate(`/events/${event.id}`)}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-br from-[#e4effc] to-[#cbd5e1] 
  text-[#732D87] text-sm font-semibold rounded-lg shadow-[6px_6px_12px_#b0bec5,-6px_-6px_12px_#ffffff] 
  hover:shadow-[4px_4px_8px_#b0bec5,-4px_-4px_8px_#ffffff] 
  active:shadow-[inset_4px_4px_8px_#b0bec5,inset_-4px_-4px_8px_#ffffff] 
  transition-all duration-300 text-center flex justify-center items-center whitespace-nowrap"
        >
          Перейти
        </button>
      </div>
    </div>
  );
};

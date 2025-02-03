import { useEffect, useState } from "react";
import EventAPI from "../api/eventApi";

export default function EventsList({ teamId }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (teamId) {
      fetchEvents(teamId);
    }
  }, [teamId]);

  const fetchEvents = async (teamId) => {
    try {
      const data = await EventAPI.getEventsByTeamId(teamId);
      setEvents(data);
    } catch (error) {
      console.error("Ошибка загрузки мероприятий:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Мероприятия</h2>

        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 mt-6">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                {event.posterUrl && (
                  <img
                    alt={event.name}
                    src={event.posterUrl}
                    className="aspect-[3/4] w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto sm:h-96"
                  />
                )}
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.dateTime).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Нет мероприятий для этой команды</p>
          )}
        </div>
      </div>
    </div>
  );
}

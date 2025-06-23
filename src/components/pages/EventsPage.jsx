import EventsList from "../EventsList";
import Calendar from "../Calendar";
import TopBar from "../TopBar";
import teamStore from "../../store/teamStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import eventStore from "../../store/eventStore";
import EventModal from "../EventModal";
import userStore from "../../store/userStore";
import { useNavigate} from "react-router-dom";
import { FaSearch, FaSort, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const EventsPage = observer(() => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list");
  const [isOpen, setIsOpen] = useState(false);

  const { selected: team } = teamStore;
  const { eventsPage, page, size, sort, search, isLoading } = eventStore;

  useEffect(() => {
    if (team?.id) eventStore.fetchForTeam();
    else navigate("/");
  }, [team?.id]);

  if (!team?.id) return <div className="p-6 text-center text-red-600">Выберите команду</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar
        title="Мероприятия"
        onSwitchChange={() => setViewMode(vm => (vm === "list" ? "calendar" : "list"))}
        switchChecked={viewMode === "calendar"}
        showSettingsIcon
      />

      <div className="px-6 py-4 space-y-6">
        {/* Фильтры */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 flex-1">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={e => eventStore.setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-700"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
              <FaSort className="text-gray-500 mr-2" />
              <select
                value={sort}
                onChange={e => eventStore.setSort(e.target.value)}
                className="bg-transparent focus:outline-none"
              >
                <option value="dateTime,desc">Сначала новые</option>
                <option value="dateTime,asc">Сначала старые</option>
                <option value="name,asc">A→Я</option>
                <option value="name,desc">Я→A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500">Загрузка…</div>
          ) : viewMode === "calendar" ? (
            <Calendar events={eventsPage || []} />
          ) : (
            <EventsList events={eventsPage || []} />
          )}
        </div>

        {/* Пагинация */}
        {eventsPage && eventsPage.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 py-4">
            <button
              onClick={() => page > 0 && eventStore.setPage(page - 1)}
              className="p-2 bg-white border rounded-md hover:bg-purple-50 transition disabled:opacity-50"
              disabled={page === 0}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: eventsPage.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => eventStore.setPage(i)}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-md transition
                  ${i === page ? "bg-purple-600 text-white" : "bg-white border hover:bg-purple-50"}
                `}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => page < eventsPage.totalPages - 1 && eventStore.setPage(page + 1)}
              className="p-2 bg-white border rounded-md hover:bg-purple-50 transition disabled:opacity-50"
              disabled={page === eventsPage.totalPages - 1}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Кнопка «+» */}
      {userStore.isAdmin && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 text-white text-3xl rounded-full shadow-lg hover:scale-105 transform transition"
        >
          +
        </button>
      )}

      {/* Модалка */}
      <EventModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={async data => {
          await eventStore.create(data);
          setIsOpen(false);
        }}
        title="Новое событие"
      />
    </div>
  );
});

export default EventsPage;

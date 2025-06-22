import { useState, useEffect } from "react";

import { observer } from "mobx-react-lite";
import eventStore from "../../store/eventStore";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EditEventModal from "../EditEventModal";
import teamStore from "../../store/teamStore";
import userStore from "../../store/userStore";
import defaultPoster from "../../assets/defaultPoster.jpg";
import TopBar from "../TopBar";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
const EventPage = observer(() => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteEventConfirmOpen, setDeleteEventConfirmOpen] = useState(false);

  useEffect(() => {
    if (eventId) {
      eventStore.fetchEvent(eventId);
    }
  }, [eventId]);

  const ev = eventStore.current;
  if (eventStore.isLoading || !ev) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">
          {eventStore.isLoading ? "Загрузка..." : "Событие не найдено"}
        </span>
      </div>
    );
  }

  const isAdmin = userStore.isAdmin;
  const meId = userStore.me?.id;
  const regs = ev.registrations ?? [];

  function requestUnregister(regId, fullName) {
    setToDelete({ id: regId, fullName });
    setConfirmOpen(true);
  }

  async function confirmUnregister() {
    if (!toDelete) return;
    await eventStore.unregister(ev.id, toDelete.id);
    setConfirmOpen(false);
    setToDelete(null);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar
        title={ev.name}
        showBackButton
        onBack={() => navigate(-1)}
        showSettingsIcon={false}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="w-full rounded-xl overflow-hidden shadow-lg bg-white">
          <img
            src={ev.posterUrl || defaultPoster}
            alt={ev.name}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-800">{ev.name}</h1>
            <p className="text-gray-700">
              <strong>Дата:</strong>{" "}
              {new Date(ev.dateTime).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {ev.location && (
              <p className="text-gray-700">
                <strong>Место:</strong> {ev.location}
              </p>
            )}
            {ev.price && (
              <p className="text-gray-700">
                <strong>Стоимость:</strong> {ev.price} руб.
              </p>
            )}
            {ev.linkToAlbum && (
              <p className="text-gray-700">
                <strong>Альбом:</strong>{" "}
                <a
                  href={ev.linkToAlbum}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  посмотреть
                </a>
              </p>
            )}
            {ev.teamResult && (
              <p className="text-gray-700">
                <strong>Результат команды:</strong> {ev.teamResult}
              </p>
            )}
            <p className="text-gray-700">
              <strong>Регистрация:</strong>{" "}
              {ev.isRegistrationOpen ? (
                <span className="text-green-600">открыта</span>
              ) : (
                <span className="text-red-600">закрыта</span>
              )}
            </p>
            {ev.isRegistrationOpen && (
              <button
                onClick={() => setRegOpen(true)}
                className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
              >
                Зарегистрироваться
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg prose prose-lg max-w-none">
            {ev.description ? (
              <div dangerouslySetInnerHTML={{ __html: ev.description }} />
            ) : (
              <p>Описание отсутствует.</p>
            )}
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Участники
          </h2>
          <ul className="space-y-3">
            {regs.length === 0 && (
              <li className="text-gray-500">Нет зарегистрированных участников</li>
            )}
            {regs.map((r) => {
              const regId = r.id;
              return (
                <li
                  key={regId}
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
                >
                  <span className="text-gray-800">{r.fullName}</span>
                  {(isAdmin || r.registrantId === meId) && regId && (
                    <button
                      onClick={() => requestUnregister(regId, r.fullName)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {isAdmin && (
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 min-w-[150px] px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
            >
              Редактировать
            </button>
            <button
              onClick={() => setDeleteEventConfirmOpen(true)}
              className="flex-1 min-w-[150px] px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Удалить
            </button>
          </div>
        )}
      </main>

      {editOpen && (
        <EditEventModal
          isOpen={editOpen}
          event={ev}
          onClose={() => setEditOpen(false)}
          onSubmit={async (fd) => {
            try {
              await eventStore.update(ev.id, fd);
              await eventStore.fetchEvent(ev.id);
            } catch (err) {
              console.error(err);
            } finally {
              setEditOpen(false);
            }
          }}
        />
      )}

      {regOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
            <h3 className="text-xl font-semibold">Регистрация</h3>
            <input
              type="text"
              placeholder="Ваше имя"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-purple-400"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setRegOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Отмена
              </button>
              <button
                onClick={async () => {
                  if (!newName.trim()) return;
                  await eventStore.register(ev.id, newName.trim());
                  setNewName("");
                  setRegOpen(false);
                }}
                className="px-4 py-2 bg-yellow-400 text-purple-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                ОК
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && toDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Подтвердите действие</h3>
            <p className="text-gray-700">Вы уверены, что хотите отписать <strong>{toDelete.fullName}</strong>?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmOpen(false) || setToDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >Отмена</button>
              <button
                onClick={confirmUnregister}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >Отписать</button>
            </div>
          </div>
        </div>
      )}

      {deleteEventConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Удалить событие</h3>
            <p className="text-gray-700">Вы уверены, что хотите удалить это событие?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteEventConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >Отмена</button>
              <button
                onClick={async () => {
                  try {
                    console.log("Удаление события:", ev.id);
                    await eventStore.delete(ev.id);
                    toast.success("Событие удалено");
                    navigate("/events");
                  } catch (e) {
                    console.error(e);
                    toast.error("Ошибка при удалении");
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >Удалить</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
});

export default EventPage;
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import notificationStore from "../../store/notificationStore";
import { useParams } from "react-router-dom";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import TopBar from "../TopBar";
import teamStore from "../../store/teamStore";
import { useCallback } from "react";
import { ClipboardIcon } from "lucide-react";
import EditTeamModal from "../EditTeamModal";
import userStore from "../../store/userStore";
const NotificationSettingsPage = observer(() => {
  const teamId     = teamStore.selected?.id
  const inviteCode = teamStore.selected?.inviteCode || ""

  // для открытия модалки редактирования
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false)

  // локальные стейты для формы редактирования
  const [teamName, setTeamName] = useState(teamStore.selected?.name || "")
  const [chatId, setChatId]     = useState(teamStore.selected?.chatId || "")

  // настройки уведомлений
  const [cfg, setCfg]       = useState({
    registrationNotificationEnabled: true,
    unregisterNotificationEnabled:   true,
    eventReminderEnabled:            true,
    registrationReminderHoursBeforeEvent: 24,
  })
  const [members, setMembers] = useState([])
  const [toast, setToast]     = useState("")

  // обновляем список участников
  const updateMembersFromStore = useCallback(() => {
    const memberships = teamStore.selected?.teamMemberships || []
    setMembers(
      memberships.map(m => ({
        id:       m.user.id,
        fullName: m.user.fullName,
        role:     m.role,
      }))
    )
  }, [teamStore.selected])

  useEffect(() => {
    if (!teamId) return

    notificationStore.load(teamId).then(stored => {
      if (stored) setCfg(stored)
    })

    updateMembersFromStore()

    // синхронизируем поля формы редактирования
    setTeamName(teamStore.selected?.name || "")
    setChatId(teamStore.selected?.chatId || "")
  }, [teamId, updateMembersFromStore])

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  // единый метод сохранения name/chatId
  const saveTeamUpdate = async (newName, newChatId) => {
    if (!teamId) return
    await teamStore.updateTeam({ teamId, newName, newChatId: newChatId, userId: userStore.me?.id })
    setIsEditTeamOpen(false)
    showToast("Данные команды обновлены")
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)
    showToast("Код приглашения скопирован")
  }

  const saveSettings = async () => {
    await notificationStore.save(cfg)
    showToast("Настройки сохранены")
  }

  const toggleModerator = async user => {
    const newRole = user.role === "MODERATOR" ? "USER" : "MODERATOR"
    await teamStore.updateUserRole({ teamId, userId: user.id, role: newRole })
    updateMembersFromStore()
    showToast(
      newRole === "MODERATOR"
        ? `${user.fullName} теперь модератор`
        : `Модераторство у ${user.fullName} снято`
    )
  }

  const removeUser = async user => {
    if (!window.confirm(`Удалить ${user.fullName} из команды?`)) return
    await teamStore.removeUserFromTeam({ teamId, userId: user.id })
    updateMembersFromStore()
    showToast(`${user.fullName} удалён из команды`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar title="Настройки" showBackButton showSettingsIcon={false} />

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Отображаем текущее имя команды */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {teamStore.selected?.name}
          </h2>
        </section>

        {/* Кнопка «Редактировать команду» */}
        <section className="flex justify-end">
          <button
            onClick={() => setIsEditTeamOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Редактировать команду
          </button>
        </section>

        {/* Модалка редактирования команды (с прозрачным фоном) */}
        <EditTeamModal
          isOpen={isEditTeamOpen}
          onClose={() => setIsEditTeamOpen(false)}
          team={{
            id:     teamId,
            name:   teamName,
            chatId: chatId,
            userId: userStore.me?.id,
          }}
          onSave={(newName, newChatId, userId) => saveTeamUpdate(newName, newChatId, userId)}
        />

        {/* Код приглашения */}
        {inviteCode && (
          <section className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Код приглашения
              </h2>
              <p className="mt-1 text-gray-600">{inviteCode}</p>
            </div>
            <button
              onClick={copyInviteCode}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <ClipboardIcon className="w-5 h-5" />
              <span>Копировать</span>
            </button>
          </section>
        )}

        {/* Настройки уведомлений */}
        <section className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Уведомления</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span>Регистрация</span>
              <Switch
                checked={cfg.registrationNotificationEnabled}
                onChange={v =>
                  setCfg(c => ({ ...c, registrationNotificationEnabled: v }))
                }
              />
            </label>
            <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span>Отмена регистрации</span>
              <Switch
                checked={cfg.unregisterNotificationEnabled}
                onChange={v =>
                  setCfg(c => ({ ...c, unregisterNotificationEnabled: v }))
                }
              />
            </label>
            <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span>Напоминание о событии</span>
              <Switch
                checked={cfg.eventReminderEnabled}
                onChange={v =>
                  setCfg(c => ({ ...c, eventReminderEnabled: v }))
                }
              />
            </label>
            <label className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span>За сколько часов до</span>
              <input
                type="number"
                min="1"
                value={cfg.registrationReminderHoursBeforeEvent}
                onChange={e =>
                  setCfg(c => ({
                    ...c,
                    registrationReminderHoursBeforeEvent: Number(e.target.value),
                  }))
                }
                className="w-16 p-1 border rounded text-center"
              />
            </label>
          </div>
          <button
            onClick={saveSettings}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Сохранить настройки
          </button>
        </section>

        {/* Таблица участников */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Участники команды
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Имя</th>
                  <th className="py-2 px-4">Роль</th>
                  <th className="py-2 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {members.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{user.fullName}</td>
                    <td className="py-3 px-4">
                      {user.role === "MODERATOR" ? (
                        <span className="text-yellow-600 font-medium">
                          Модератор
                        </span>
                      ) : (
                        <span className="text-gray-600">Участник</span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => toggleModerator(user)}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-900 rounded hover:opacity-90 transition"
                      >
                        {user.role === "MODERATOR"
                          ? "Снять модератора"
                          : "Сделать модератором"}
                      </button>
                      <button
                        onClick={() => removeUser(user)}
                        className="px-3 py-1 bg-red-400 text-white rounded hover:opacity-90 transition"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Центрированный Toast */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-gray-800 bg-opacity-80 text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
})

export default NotificationSettingsPage
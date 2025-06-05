// src/api/teamService.js
import { requests } from './requests'

const BASE = '/teams'
import commonStore from '../store/commonStore'
const TeamService = {
  /**
   * Создать новую команду
   * @param {{ teamName: string, chatId?: string }} params
   */
  createTeam(teamName, chatId) {
  const userId = commonStore.userId
  const params = new URLSearchParams({
    teamName,
    userId: String(userId),
  })
  if (chatId) params.append('chatId', chatId)
  return requests.post(`/teams?${params.toString()}`)
},

  /** Получить все команды */
  getTeams() {
    return requests.get(`${BASE}`)
  },

  /** Получить команду по ID */
  getTeamById(teamId) {
    return requests.get(`${BASE}/${teamId}`)
  },

  /** Получить команду по коду-приглашению */
  getTeamByInviteCode(inviteCode) {
    return requests.get(`${BASE}/invite/${encodeURIComponent(inviteCode)}`)
  },

  /**
   * Добавить пользователя в команду
   * @param {{ teamId: number, userId: number, role: string }} params
   */
  addUserToTeam({ teamId, userId, role }) {
    const query = `?userId=${userId}&role=${encodeURIComponent(role)}`
    return requests.post(`${BASE}/${teamId}/addUser${query}`)
  },

  /**
   * Удалить пользователя из команды
   * @param {{ teamId: number, userId: number }} params
   */
  removeUserFromTeam({ teamId, userId }) {
    return requests.delete(`${BASE}/${teamId}/removeUser?userId=${userId}`)
  },

  /** Получить всех пользователей в команде */
  getUsersInTeam(teamId) {
    return requests.get(`${BASE}/${teamId}/users`)
  },

  /** Получить все команды, в которых состоит пользователь */
  getTeamsByUser(userId) {
    return requests.get(`${BASE}/user/${userId}`)
  },

  /** Удалить команду по ID */
  deleteTeamById(teamId) {
    return requests.delete(`${BASE}/${teamId}`)
  },

  /** Получить настройки уведомлений для команды */
  getNotificationSettings(teamId) {
    return requests.get(`${BASE}/${teamId}/notifications`)
  },

  /**
   * Добавить пользователя в команду
   * @param {{ teamId: number, userId: number, role: string }} params
   */
  addUserToTeam({ teamId, userId, role }) {
    const query = `?userId=${userId}&role=${encodeURIComponent(role)}`;
    return requests.post(`${BASE}/${teamId}/addUser${query}`);
  },

  /**
   * Удалить пользователя из команды
   * @param {{ teamId: number, userId: number }} params
   */
  removeUserFromTeam({ teamId, userId }) {
    return requests.delete(`${BASE}/${teamId}/removeUser?userId=${userId}`);
  },

  /**
   * Обновить роль пользователя в команде
   * @param {{ teamId: number, userId: number, role: string }} params
   */
  updateUserRole({ teamId, userId, role }) {
    const query = `?userId=${userId}&role=${encodeURIComponent(role)}`;
    // PUT или POST — смотря какой метод на бэке
    return requests.put(`${BASE}/${teamId}/updateUserRole${query}`);
  },
  /**
   * Обновить настройки уведомлений
   * @param {{ teamId: number, settings: object, userId: number }} params
   */
  updateNotificationSettings({ teamId, settings, userId }) {
    return requests.put(
      `${BASE}/${teamId}/notifications?userId=${userId}`,
      settings
    )
  },

  /** Получить все события команды */
  getEventsByTeam(teamId) {
    return requests.get(`${BASE}/${teamId}/events`)
  },


  updateTeam({ teamId, newName, newChatId,userId }) {
    const params = new URLSearchParams()
    if (userId != null) params.append('userId', userId)
    if (newName != null) params.append('newName', newName)
    if (newChatId != null) params.append('newChatId', newChatId)
    return requests.put(`${BASE}/${teamId}?${params.toString()}`)
  },
}

export default TeamService

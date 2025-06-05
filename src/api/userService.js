// src/api/userService.js
import { requests } from "./requests"

const BASE = '/users'

const UserService = {
  /** Получить текущего пользователя */
  getCurrentUser() {
    return requests.get(`${BASE}/me`)
  },

  /** Получить пользователя по ID */
  getUserById(userId) {
    return requests.get(`${BASE}/${userId}`)
  },

  /** Получить всех пользователей */
  getAllUsers() {
    return requests.get(`${BASE}`)
  },

  /** Удалить пользователя */
  deleteUser(userId) {
    return requests.delete(`${BASE}/${userId}`)
  },

  /**
   * Обновить информацию о пользователе.
   * @param {number} userId
   * @param {{ fullname?: string, role?: string }} params
   */
  updateUserInfo(userId, { fullname, role }) {
    const qp = new URLSearchParams()
    if (fullname != null) qp.append('fullname', fullname)
    if (role     != null) qp.append('role',     role)
    return requests.put(`${BASE}/${userId}/update?${qp.toString()}`)
  },

  /** Список команд, в которых состоит пользователь */
  getTeamsByUser(userId) {
    return requests.get(`${BASE}/${userId}/teams`)
  },

  /**
   * Присоединить пользователя к команде по inviteCode
   * @param {number} userId
   * @param {string} inviteCode
   */
  joinTeam(userId, inviteCode) {
    return requests.post(`${BASE}/${userId}/join?inviteCode=${encodeURIComponent(inviteCode)}`)
  },

  /**
   * Покинуть команду по inviteCode
   * @param {number} userId
   * @param {string} inviteCode
   */
  leaveTeam(userId, inviteCode) {
    return requests.delete(`${BASE}/${userId}/leave?inviteCode=${encodeURIComponent(inviteCode)}`)
  },

  /** Получить всех участников заданной команды */
  getAllMembersOfTeam(teamId) {
    return requests.get(`${BASE}/team/${teamId}/members`)
  },

  /** Проверить, админ ли пользователь в команде */
  isUserAdmin(userId, teamId) {
    return requests.get(`${BASE}/${userId}/team/${teamId}/isAdmin`)
  },

    /** Проверить, админ ли пользователь в команде */
  isUserMainAdmin(userId) {
    return requests.get(`${BASE}/${userId}/isAdmin`)
  },

  /** Получить роль пользователя в команде */
  getUserRoleInTeam(userId, teamId) {
    return requests.get(`${BASE}/${userId}/team/${teamId}/role`)
  },

  /**
   * Обновить роль пользователя в команде
   * @param {number} userId
   * @param {number} teamId
   * @param {string} newRole
   */
  updateUserRole(userId, teamId, newRole) {
    return requests.put(
      `${BASE}/${userId}/team/${teamId}/updateRole?newRole=${encodeURIComponent(newRole)}`
    )
  },
}

export default UserService

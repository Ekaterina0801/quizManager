import { requests } from "./requests"

const BASE = '/team-notifications'

const TeamNotificationService = {
  /**
   * Получить настройки уведомлений для команды
   * @param {number} teamId
   * @returns {Promise<TeamNotificationSettingsCreationDto>}
   */
  getSettings(teamId) {
    return requests.get(`${BASE}/${teamId}`)
  },

  /**
   * Создать или обновить настройки
   * @param {number} teamId
   * @param {TeamNotificationSettingsCreationDto} dto
   * @returns {Promise<TeamNotificationSettingsCreationDto>}
   */
  saveSettings(teamId, dto) {
    return requests.post(`${BASE}/${teamId}`, dto)
  },

  /**
   * Удалить настройки
   * @param {number} teamId
   * @returns {Promise<void>}
   */
  deleteSettings(teamId) {
    return requests.delete(`${BASE}/${teamId}`)
  },
}

export default TeamNotificationService

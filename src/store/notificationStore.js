import { makeAutoObservable, runInAction } from 'mobx'
import TeamNotificationService from '../api/teamNotificationsService';
import userStore from './userStore'

class NotificationStore {
  settings = {}
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  async load(teamId = userStore.selectedTeamId) {
    if (!teamId) return
    if (this.settings[teamId]) return this.settings[teamId]

    this.isLoading = true
    try {
      const cfg = await TeamNotificationService.getSettings(teamId)
      runInAction(() => {
        this.settings[teamId] = cfg
      })
      return cfg
    } catch (err) {
      console.error('loadNotificationSettings', err)
      throw err
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  /** Сохранить */
  async save(updated, teamId = userStore.selectedTeamId) {
    if (!teamId) throw new Error('No team')
    this.isLoading = true
    try {
      const cfg = await TeamNotificationService.saveSettings(teamId, updated)
      runInAction(() => {
        this.settings[teamId] = cfg
      })
      return cfg
    } catch (err) {
      console.error('updateNotificationSettings', err)
      throw err
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }
}

export default new NotificationStore()

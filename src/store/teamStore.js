import { makeAutoObservable, runInAction } from 'mobx'
import teamService from '../api/teamService'
import userStore from './userStore'
import commonStore from './commonStore'
class TeamStore {
  list = []
  selected = null
  isLoading = false

  constructor() {
    makeAutoObservable(this)
    const stored = localStorage.getItem('teamId')
    if (stored) {
      this.select(Number(stored))
      console.log('Restored team from localStorage:', stored)
    }
  }

  async fetchAll() {
    this.isLoading = true
    try {
      const all = await teamService.getTeams()
      runInAction(() => { this.list = all })
    } finally {
      runInAction(() => { this.isLoading = false })
    }
  }

  async fetchAllByUserId(userId) {
    this.isLoading = true
    try {
      const all = await teamService.getTeamsByUser(userId)
      runInAction(() => { this.list = all })
    } finally {
      runInAction(() => { this.isLoading = false })
    }
  }

    async select(id) {
    this.isLoading = true
    try {
      const team = await teamService.getTeamById(id)
      runInAction(() => {
        this.selected = team
        localStorage.setItem('teamId', id)
        userStore.selectedTeamId = id
        userStore.checkAdmins(userStore.me.id,id)
      })
    } finally {
      runInAction(() => { this.isLoading = false })
    }
  }


  async create(name, chatId) {
    this.isLoading = true
    try {
      const team = await teamService.createTeam(name, chatId)
      runInAction(() => { this.list.push(team) })
      return team
    } finally {
      runInAction(() => { this.isLoading = false })
    }
  }

  async addUserToTeam({ teamId, userId, role }) {
    await teamService.addUserToTeam({ teamId, userId, role });
    await this.select(teamId);
  }

  async removeUserFromTeam({ teamId, userId }) {
    await teamService.removeUserFromTeam({ teamId, userId });
    await this.select(teamId);
  }

  async updateUserRole({ teamId, userId, role }) {
    await teamService.updateUserRole({ teamId, userId, role });
    await this.select(teamId);
  }

  async renameTeam({ teamId, newName }) {
    this.isLoading = true;
    try {
      const updated = await teamService.renameTeam({ teamId, newName });
      runInAction(() => {
        this.selected = updated;
        const idx = this.list.findIndex(t => t.id === teamId);
        if (idx >= 0) this.list[idx] = updated;
      });
    } finally {
      runInAction(() => this.isLoading = false);
    }
  }

  async updateTeam({ teamId, newName, newChatId, userId }) {
    this.isLoading = true
    try {
      const updated = await teamService.updateTeam({ teamId, newName, newChatId,userId })
      runInAction(() => {
        this.selected = updated
        const idx = this.list.findIndex(t => t.id === teamId)
        if (idx >= 0) this.list[idx] = updated
      })
      return updated
    } finally {
      runInAction(() => { this.isLoading = false })
    }
  }
}

export default new TeamStore()
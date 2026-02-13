import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state() {
    return {
      user: null,
      darkMode: true,
      host: {
        id: 0,
        name: '',
        addr: '',
        hostStatus: 0,
      }, // 选中的主机信息
      search: '', // 搜索的字符
      addWebsite: {
        // 站点添加组件信息
        dns: -1, // DNS账户
      },
      move: '',
      WebSite: {},
      hostId: 0,
      webSiteHostId: 0,
      historyList: [],
      pathList: [],
    }
  },
  actions: {
    setUserInfo(userInfo) {
      this.user = userInfo
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    setMove(model) {
      this.move = model
    },
    setFormStatus(model) {
      this.WebSite = model
    },
    setHistory(model) {
      this.historyList = model
    },
    setPath(model) {
      this.pathList = model
    },
  },
  persist: true,
})

export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}


export const formatDateTimeNew = (dateTime) => {
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return `${year}-${month}-${day}-${hour}:${minutes}:${seconds}`
}

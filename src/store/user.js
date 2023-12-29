import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
    state() {
        return {
            user: null
        }
    },
    actions:{
        setUserInfo(userInfo){
            this.user = userInfo
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
        }
    },
    persist: true
})
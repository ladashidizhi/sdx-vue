import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
    state() {
        return {
            userId: 0, // User ID
            token: "" // Token信息
        }
    }
})
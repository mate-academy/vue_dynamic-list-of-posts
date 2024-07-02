import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { getUsers } from '@/api/users'
import type { User } from '@/types/User'

export const useUserStore = defineStore('users', {
  state: () => ({
    isUserAuthenticated: useLocalStorage('login', false),
    user: useLocalStorage('user', {
      email: null as null | string,
      name: null as null | string,
      id: null as null | number
    })
  }),

  actions: {
    async hasUserInDB(user: string): Promise<User | undefined | false> {
      const users = (await getUsers<User[]>()).data

      if (!users || users.length === 0) {
        return false
      } else {
        const findUser = users.find((userRes) => {
          return userRes.email && userRes.email.toLowerCase() === user.toLowerCase()
        })

        if (findUser && findUser.email && findUser.name) {
          this.isUserAuthenticated = true
          this.user.email = findUser.email
          this.user.name = findUser.name
          this.user.id = findUser.id
        }

        return findUser
      }
    }
  }
})

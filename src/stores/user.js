import { createUser, getUser } from "@/api/users";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    email: '',
    isNotRegistered: false,
  }),
  actions: {
    async fetchUserByEmail(email) {
      this.email = email;
      const fetchedUser = await getUser(email);
      if (fetchedUser) {
        this.user = fetchedUser;
        this.isNotRegistered = false;
      } else {
        this.user = null;
        this.isNotRegistered = true;
      }
    },
    async registerUser(name) {
      if (this.email && name) {
        await createUser(this.email, name);
        const createdUser = await getUser(this.email);
        this.user = createdUser;
        this.isNotRegistered = false;
      }
    },
    logout() {
      this.user = null;
      this.email = '';
      this.isNotRegistered = false;
    },
  }
})
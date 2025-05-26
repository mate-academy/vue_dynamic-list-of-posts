import { defineStore } from 'pinia';
import { createUser } from '../api/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('userData')) || null,
    newUser: {
      name: '',
      username: '',
      email: '',
      phone: '',
    },
    errorMessages: {
      fetch: null,
      name: null,
      username: null,
      email: null,
      phone: null,
    },
  }),

  actions: {
    setUser(userData) {
      this.user = userData;
      localStorage.setItem('userData', JSON.stringify(userData));
    },

    async createNewUser() {
      const { name, username, email, phone } = this.newUser;
      const newUserData = { name, username, email, phone };
      this.errorMessages.fetch = null;
      try {
        const createdUser = await createUser(newUserData);
        this.user = createdUser;
        this.setUser(createdUser);
        this.newUser = { name: '', username: '', email: '', phone: '' };
      } catch (err) {
        this.errorMessages.fetch = 'Error creating user: ' + err.message;
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem('userData');
    },
  },
});

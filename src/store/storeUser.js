// stores/useCommentsStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getUserByEmail,
  createUser,
} from '@/api/user';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
  };
  

  return {
    user,
    setUser,
  };
});

import { reactive } from 'vue';

export const userStore = reactive({
  user: null,
});

export function setUser(user) {
  userStore.user = user;
}

export function getUser() {
  return userStore.user;
}

export function clearUser() {
  userStore.user = null;
}

import { ref } from 'vue';

export function useAuth() {
  const user = ref({ id: 1, name: 'John Doe' }); // Mock user

  const logout = () => {
    user.value = null;
  };

  return { user, logout };
}
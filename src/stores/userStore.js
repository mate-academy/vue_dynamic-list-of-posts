import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const init = () => {
    const saverUser = localStorage.getItem("user");

    if (saverUser) {
      user.value = JSON.parse(saverUser);
    }
  };

  const login = (newUser) => {
    user.value = newUser;
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
  };

  return { user, init, login, logout };
});

export default useUserStore;

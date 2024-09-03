<script setup lang="ts">
import { login, register } from "./assets/api/api";
import type { User } from "./assets/types/User";
import Header from "./components/Header.vue";
import Login from "./components/Login.vue";
import PostList from "./components/PostList.vue";

import { ref, onMounted } from "vue";

const localUser = ref<User | null>(null);
const loginError = ref(false);
const registerForm = ref(false);

const saveUserToStorage = (user: User) => {
  localUser.value = user;
  localStorage.setItem("user", JSON.stringify(user));
};

const logOut = () => {
  localStorage.removeItem("user");
  localUser.value = null;
};

const loadUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    return JSON.parse(storedUser) as User;
  }
  return null;
};

onMounted(() => {
  localUser.value = loadUserFromStorage();
});

const onLogin = (email: String) => {
  login(email)
    .then((res) => {
      if (!res[0]) {
        registerForm.value = true;
      } else {
        saveUserToStorage(res[0]);
      }
      loginError.value = false;
    })
    .catch((err) => {
      loginError.value = true;
      console.log(err);
    });
};

const onRegister = (email: String, name: String) => {
  register(email, name).then((res) => {
    saveUserToStorage(res);
  });
};
</script>

<template>
  <Login
    v-if="!localUser"
    @handleLogin="onLogin"
    @handleRegister="onRegister"
    :loginError="loginError"
    :registerForm="registerForm"
  />
  <template v-else>
    <Header :user="localUser" :handleLogOut="logOut" />
    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostList />
        </div>
      </div>
    </main>
  </template>
</template>

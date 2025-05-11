<script setup>
import { onMounted, ref, watch } from "vue";
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";
import Login from "./components/Login.vue";
import { getUserByEmail } from "./api/user";
import { useUserStore } from "./store/storeUser";

const userStore = useUserStore();

onMounted(() => {
  const res = JSON.parse(localStorage.getItem("user"));

  if (res) {
    userStore.setUser(res);
  }
});

const setUser = (userValue) => {
  userStore.setUser(userValue || null);
  localStorage.setItem('user', JSON.stringify(userValue || null));
};

</script>

<template>
  <Login
    v-if="!userStore.user || !userStore.user.email"
    @login="setUser"
  />

  <template v-else>
    <Header @logout="setUser" />

    <Main />
  </template>
</template>

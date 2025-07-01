<script setup>
import { ref } from "vue";
import AppHeader from "./components/AppHeader.vue";
import LoginPage from "./components/LoginPage.vue";
import PostsList from "./components/PostsList.vue";

// console.log(userData, parsedUserData, isLoggedIn);
const handleLogout = () => {
  localStorage.removeItem("user");
  isLoggedIn.value = false;
};

const onLoginSuccess = () => {
  const userData = localStorage.getItem("user");
  isLoggedIn.value = userData ? true : false;
};

</script>

<template>
  <div>
    <LoginPage v-if="!isLoggedIn" @login-success="onLoginSuccess" />
    <template v-else>

    </template>
  </div>
</template>

<style>
.flex {
  display: flex;
  gap: 24px;
}
.flex > div {
  flex:1;
  box-sizing: border-box;
}
</style>

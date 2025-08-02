<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import LoginPage from './components/LoginPage.vue'
import PostsList from './components/PostsList.vue';

import { ref } from "vue";
const userData = localStorage.getItem('user');
const parsedUserData = userData ? JSON.parse(userData) : null;
const isLoggedIn = ref(parsedUserData);

const handleLogout = () => {
  localStorage.removeItem('user');
  isLoggedIn.value = null;
};

const onLoginSuccess = () => {
  const userData = localStorage.getItem('user');
  isLoggedIn.value = userData ? JSON.parse(userData) : null;
};

</script>

<template>
  <LoginPage v-if="!isLoggedIn" @loginSuccess="onLoginSuccess" />
  <template v-else>
    <AppHeader :userData="parsedUserData" @logout="handleLogout"/>
    <PostsList :userId="parsedUserData.id"/>
  </template>
</template>

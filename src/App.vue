<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import LoginPage from './components/LoginPage.vue'
import PostsList from './components/PostsList.vue'

import { ref } from 'vue'

// Храним сразу весь user как реактивный объект
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

const handleLogout = () => {
  localStorage.removeItem('user')
  user.value = null
}

const onLoginSuccess = (newUser: any) => {
  localStorage.setItem('user', JSON.stringify(newUser))
  user.value = newUser
}
</script>

<template>
  <LoginPage v-if="!user" @loginSuccess="onLoginSuccess" />
  <template v-else>
    <AppHeader :userData="user" @logout="handleLogout" />
    <PostsList :userId="user.id" />
  </template>
</template>

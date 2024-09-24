<script setup>
import { onMounted, ref } from 'vue'
import LoginPage from './components/LoginPage.vue'
import Header from './components/Header.vue'
import PostsList from './components/PostsList.vue'

const user = ref({})
const isLoginPage = ref(true)

const handleLogin = ($event) => {
  user.value = $event
  isLoginPage.value = false
}

const handleLogout = () => {
  localStorage.removeItem('user')
  user.value = {}
  isLoginPage.value = true
}

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'))

  if (storedUser) {
    user.value = storedUser
    isLoginPage.value = false
  }
})
</script>

<template>
  <LoginPage @login="handleLogin" v-if="isLoginPage" />
  <template v-else>
    <Header :user @logout="handleLogout" />
    <PostsList :user />
  </template>
</template>

<style></style>

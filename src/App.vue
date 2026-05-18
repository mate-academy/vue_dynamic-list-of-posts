<script setup>
import { onBeforeUnmount, ref } from 'vue'

import AppHeader from './components/AppHeader.vue'
import LoginPage from './components/LoginPage.vue'
import PostsList from './components/PostsList.vue'

const USER_STORAGE_KEY = 'loggedInUser'

const isUser = (value) => Boolean(value?.id && value?.name)

const getSavedUser = () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY))

    if (isUser(savedUser)) {
      return savedUser
    }

    localStorage.removeItem(USER_STORAGE_KEY)

    return null
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)

    return null
  }
}

const user = ref(getSavedUser())

const redirectTo = (path) => {
  if (window.location.pathname !== path) {
    window.history.replaceState({}, '', path)
  }
}

const syncAuthRoute = () => {
  if (!user.value && window.location.pathname !== '/login') {
    redirectTo('/login')

    return
  }

  if (user.value && window.location.pathname === '/login') {
    redirectTo('/')
  }
}

syncAuthRoute()

window.addEventListener('popstate', syncAuthRoute)

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncAuthRoute)
})

const goTo = (path) => {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
    syncAuthRoute()
  }
}

const handleLogin = (loggedInUser) => {
  if (!isUser(loggedInUser)) {
    return
  }

  user.value = loggedInUser
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser))
  goTo('/')
}

const handleLogout = () => {
  user.value = null
  localStorage.removeItem(USER_STORAGE_KEY)
  goTo('/login')
}
</script>

<template>
  <div data-theme="light" style="color-scheme: light">
    <LoginPage v-if="!user" @login="handleLogin" />

    <template v-else>
      <AppHeader :user="user" @logout="handleLogout" />

      <main class="section">
        <PostsList :user-id="user.id" />
      </main>
    </template>
  </div>
</template>

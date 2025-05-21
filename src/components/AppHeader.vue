<script setup>
import { logoutUser } from '@/utils/LocalStorage'

const user = defineModel('user', {
  type: Object,
})

const handleLogout = () => {
  logoutUser()
  user.value = null
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h1 class="title is-size-4">Vue List Of Posts</h1>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ user?.name }}</p>
          </div>

          <a class="button is-light" @click="handleLogout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style></style>

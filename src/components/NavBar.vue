<script lang="ts">
import { useUserStore } from '@/stores/users'

export default {
  emits: ['handleLogout'],

  setup() {
    const userStore = useUserStore()

    return { userStore }
  },

  computed: {
    userName() {
      return this.userStore.user.name
    }
  }
}
</script>

<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
    v-if="$route.fullPath !== '/login'"
  >
    <div class="navbar-item">
      <h1 class="title is-size-4">Vue List Of Posts</h1>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ userName }}</p>
          </div>

          <RouterLink to="/login" @click.prevent="$emit('handleLogout')" class="button is-light"
            >Logout</RouterLink
          >
        </div>
      </div>
    </div>
  </nav>
</template>

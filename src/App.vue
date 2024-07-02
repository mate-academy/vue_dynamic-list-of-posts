<script lang="ts">
import NavBar from './components/NavBar.vue'
import { usePostsStore } from './stores/posts'
import { useUserStore } from './stores/users'

export default {
  components: { NavBar },

  methods: {
    handleLogout() {
      const userStore = useUserStore()
      const postsStore = usePostsStore()

      userStore.isUserAuthenticated = false
      userStore.user.email = null
      userStore.user.name = null
      userStore.user.id = null
      postsStore.posts = []
    }
  }
}
</script>

<template>
  <NavBar @handle-logout="handleLogout" />

  <main class="section">
    <RouterView />
  </main>
</template>

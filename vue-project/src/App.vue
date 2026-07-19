<script lang="ts">
import LoginView from './components/LoginView.vue'
import PostsView from './components/PostsView.vue'

export default {
  components: {
    LoginView,
    PostsView,
  },
  data() {
    return {
      email: localStorage.getItem('emLogin') || '',
    }
  },
  methods: {
    logout() {
      this.email = ''
    },
  },
}
</script>

<template>
  <div id="app">
    <LoginView v-if="!email" />
    <PostsView v-else @logout="logout" />
  </div>
</template>

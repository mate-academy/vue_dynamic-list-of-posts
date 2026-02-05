<script lang="ts">
export default {
  name: 'HeaderComponent',

  props: {
    userName: {
      required: true,
    },
  },

  methods: {
    goToMain() {
      localStorage.removeItem('userId');

      this.$router.replace('/');
    }
  }
}
</script>

<template>
  <nav class="navbar post-navbar">
    <div class="navbar-brand">
      <h1 class="title post-title">Vue List Of Posts</h1>
    </div>

    <div class="navbar-end post-navbar-end">
      <h2 class="subtitle post-subtitle">User: {{ userName }}</h2>
      <button class="button is-light post-button" @click="goToMain">Logout</button>
    </div>
  </nav>
</template>

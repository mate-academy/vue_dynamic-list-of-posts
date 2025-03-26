<script>
import AppHeader from './components/AppHeader.vue';
import AppLogin from './components/AppLogin.vue'
import AppPostsPage from './components/AppPostsPage.vue';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null,
    }
  },
  methods: {
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    }
  },
  components: {
    AppLogin,
    AppPostsPage,
    AppHeader
  },
}
</script>

<template>
  <AppLogin 
    @login="this.user = $event"
    v-if="!user"
  />

  <span v-else>
    <AppHeader
      @logout="logout"
      :user="user"
    />

    <AppPostsPage 
      :user="user" 
    />
  </span>
</template>

<style>
</style>

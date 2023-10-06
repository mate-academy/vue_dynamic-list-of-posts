<script>
import AppHeader from './components/AppHeader.vue';
import AppLogin from './components/AppLogin.vue'
import AppPostsPage from './components/AppPostsPage.vue';

export default {
  data() {
    return {
      user: null,
    }
  },
  methods: {

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
      @logout="this.user = null"
      :user="user"
    />

    <AppPostsPage 
      :user="user" 
    />
  </span>
</template>

<style>
</style>

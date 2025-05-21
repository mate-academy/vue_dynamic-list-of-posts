<script>
import { getUsers } from './api/api';
import Header from './components/Header.vue';
import Login from './components/Login.vue';
import PostsList from './components/PostsList.vue';

export default {
  components: {
    Login,
    Header,
    PostsList,
  },
  data() {
    return {
      users: [],
      user: null,
      isUserLoading: false,
    };
  },

  created() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  },

  mounted() {
    getUsers().then(({ data }) => {
      this.users = data;
    });
  },

  methods: {
    async setUser(user) {
      this.isUserLoading = true;

      await new Promise((resolve) => setTimeout(resolve, 300));
      this.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      this.isUserLoading = false;
    },

    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
};
</script>

<template>
  <Login
    v-if="user === null"
    :users="users"
    :isLoading="isUserLoading"
    @update-user="setUser"
  />
  <template v-else>
    <Header :user="user" @logout="logout" />
    <PostsList :user="user" />
  </template>
</template>

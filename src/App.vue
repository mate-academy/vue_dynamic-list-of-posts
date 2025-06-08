<script>
import { getUserByEmail } from './api/users';
import { getLocalStorage } from './utils/getLocalStorage';
import Login from './components/Login.vue';
import MainContent from './components/MainContent.vue';

export default {
  name: 'App',
  components: {
    Login,
    MainContent,
  },

  data() {
    return {
      needLogin: true,
    };
  },

  created() {
    const user = getLocalStorage('user');

    if (user && user.email) {
      this.gettingUser(user.email);
    } else {
      this.needLogin = true;
    }
  },

  methods: {
    gettingUser(email) {
      getUserByEmail(email)
        .then(({ data }) => {
          if (data.length !== 0) {
            this.$store.commit('setUserId', data[0].id);
            this.needLogin = false;
          } else {
            this.needLogin = true;
          }
        })
        .catch((err) => {
          console.error('Failed to get user by email:', err);
          this.needLogin = true;
        });
    },
  },
};
</script>

<template>
  <Login v-if="needLogin" @login="needLogin = false" />
  <MainContent v-else @logout="needLogin = true" />
</template>

<style></style>

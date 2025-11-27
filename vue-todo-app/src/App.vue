<script>
import LoginPage from './components/LoginPage.vue';
import PostHeader from './components/PostHeader.vue';
import PostsList from './components/PostsList.vue';

  export default {
    name: 'App',
    components: {
      PostsList,
      PostHeader,
      LoginPage,
    },
    data() {
      return {
        user: {},
        isActiveLoginPage: true,
      };
    },
    mounted() {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        this.user = savedUser;
        this.isActiveLoginPage = false;
      }
    },
    methods: {
      addUser($event) {
        this.user = { ...$event[0] };
        this.isActiveLoginPage = false;
      },
      logout() {
        localStorage.removeItem("user");
        this.user = {};
        this.isActiveLoginPage = true;
      },
    },
  }
</script>

<template>
  <LoginPage v-if="isActiveLoginPage" @addUser="addUser" />

  <template v-else>
    <PostHeader :user="user" @logout="logout" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostsList :userId="user.id" />
        </div>
      </div>
    </main>
  </template>
</template>

<style></style>

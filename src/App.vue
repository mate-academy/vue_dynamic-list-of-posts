<script>
import PostList from "./components/PostList.vue";
import AppHeader from "./components/Header.vue";
import LoginPage from "./components/LoginPage.vue";
export default {
  components: {
    PostList,
    AppHeader,
    LoginPage,
  },
  data() {
    return {
      user: {},
      isActiveLoginPage: true,
    };
  },
  watch: {
    user() {
      console.log(this.user);
    },
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
};
</script>

<template>
  <LoginPage v-if="isActiveLoginPage" @addUser="addUser" />

  <template v-else>
    <AppHeader :user="user" @logout="logout" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostList :userId="user.id" />
        </div>
      </div>
    </main>
  </template>
</template>

<style></style>

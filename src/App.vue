<script>
import AppHeader from "./components/AppHeader.vue";
import Login from "./components/Login.vue";
import PostsList from "./components/PostsList.vue";
import { getPosts } from "./http-client.js";

export default {
  data() {
    return {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    };
  },
  components: {
    Login,
    AppHeader,
    PostsList,
  },
  watch: {
    user() {
      if (this.user !== null) {
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },
  },
};
</script>

<template>
  <div v-if="!this.user">
    <Login v-model="user" />
  </div>

  <template v-else="true">
    <AppHeader v-model="user" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostsList :user="this.user" />
        </div>
      </div>
    </main>
  </template>
</template>

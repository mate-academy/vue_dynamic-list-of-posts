<script>
import AppHeader from "./components/AppHeader.vue";
import Login from "./components/Login.vue";

import PostsList from "./components/PostsList.vue";
import { getPosts } from "./http-client.js";
export default {
  data() {
    return {
      // email: "",
      user: null,
      // userId: null,
      // isAuthenticated: false,
      posts: [],
    };
  },
  components: {
    Login,
    AppHeader,
    PostsList,
  },
  mounted() {
    getPosts().then((response) => {
      this.posts = response.data;
      // console.log(response.data);
    });
  },
};
</script>

<template>
  <div v-if="!this.user">
    <Login v-model="user" />
  </div>

  <div v-else="true">
    <AppHeader v-model="user" />
    <PostsList :posts="this.posts" />
  </div>
</template>

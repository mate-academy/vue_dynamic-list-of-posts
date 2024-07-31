<script>
import AppHeader from "./components/AppHeader.vue";
import Login from "./components/Login.vue";
import PostsList from "./components/PostsList.vue";
import { getPosts } from "./http-client.js";

export default {
  data() {
    return {
      user: null,
      posts: [],
    };
  },
  components: {
    Login,
    AppHeader,
    PostsList,
  },
  watch: {
    user() {
      if (!!this.user) {
        getPosts(this.user.id).then((response) => {
          this.posts = response.data;
          // console.log(response.data);
        });
      }
    },
    //   currentPost() {
    //     console.log("currentPost:", this.currentPost);
    //     this.$nextTick(() => console.log("isSidebarOpen:", this.isSidebarOpen));
    //   },
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
          <PostsList :posts="this.posts" />
        </div>
      </div>
    </main>
  </template>
</template>

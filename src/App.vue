<script>
import * as postsApi from "./api/posts.js";
import AppHeader from "./components/Header.vue";
import PostsList from "./components/PostList.vue";
import AddPostPopup from "./components/AddPostPopup.vue";
import LoginPage from "./components/LoginPage.vue";

export default {
  components: { AppHeader, PostsList, AddPostPopup, LoginPage },

  data() {
    return {
      posts: [],
      user: {},
      isLoading: true,
      error: null,
    };
  },

  async mounted() {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }

      const [postsRes] = await Promise.all([
        postsApi.getPostsByUserId(this.user.id),
      ]);
      this.posts = postsRes.data;
    } catch (e) {
      console.error(e);
      this.error = "Failed to load posts. Please try again later.";
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    async addPost(postData, done) {
      const res = await postsApi.createPost({
        title: postData.title,
        body: postData.body,
        userId: this.user.id,
      });

      this.posts.unshift(res.data);

      if (typeof done === "function") {
        done(res.data);
      }
    },

    async removePost(postId) {
      await postsApi.deletePost(postId);
      this.posts = this.posts.filter((post) => post.id !== postId);
    },

    async editPost(postData) {
      const res = await postsApi.updatePost(postData.id, {
        title: postData.title,
        body: postData.body,
      });

      this.posts = this.posts.map((post) =>
        post.id === postData.id ? { ...post, ...res.data } : post
      );
    },

    saveUser(userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      this.user = userData;
    },

    removeUser() {
      localStorage.removeItem("user");
      this.user = {};
    },

    isLoggedIn() {
      return Boolean(this.user.id);
    },
  },
};
</script>

<template>
  <LoginPage v-if="!isLoggedIn()" @addUser="saveUser" />

  <template v-else>
    <AppHeader :user="user" @logout="removeUser" />

    <main class="section">
      <div class="container">
        <div v-if="isLoading" class="has-text-centered">
          <p>Ładowanie postów...</p>
        </div>

        <div v-else-if="error" class="notification is-danger">
          {{ error }}
        </div>

        <div v-else class="tile is-ancestor is-flex is-flex-wrap-wrap">
          <PostsList
            :posts="posts"
            :isLoading="isLoading"
            @add="addPost"
            @delete="removePost"
            @edit="editPost"
          />
        </div>
      </div>
    </main>
  </template>
</template>

<style>
.notification {
  margin-top: 1rem;
}
</style>

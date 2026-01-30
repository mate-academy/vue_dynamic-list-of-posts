<script>
import { getPosts, removePost } from "./api/posts";
import Loader from "./components/Loader.vue";
import Login from "./components/Login.vue";
import PostPreview from "./components/PostPreview.vue";
import PostList from "./components/PostsList.vue";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import AddPost from "./components/AddPost.vue";
import EditPost from "./components/EditPost.vue";
import Notification from "./components/Notification.vue";

export default {
  name: "App",
  components: {
    Header,
    Login,
    Loader,
    PostList,
    PostPreview,
    Sidebar,
    AddPost,
    EditPost,
    Notification,
  },
  data() {
    return {
      user: null,
      posts: [],
      isLoading: false,
      errorMessage: "",
      isSidebarOpen: false,
      selectedPostId: null,
      wantAddPost: false,
      wantEditPost: false,
    };
  },
  computed: {
    selectedPost() {
      return this.posts.find((post) => post.id === this.selectedPostId);
    },
  },
  methods: {
    onLogin(user) {
      this.user = user;
      this.loadPosts();
    },
    logOut() {
      this.user = null;
      this.closePost();
    },
    loadPosts() {
      this.isLoading = true;
      getPosts(this.user.id)
        .then((data) => (this.posts = data))
        .catch(() => (this.errorMessage = "Unable to load posts"))
        .finally(() => (this.isLoading = false));
    },
    openPost(postId) {
      this.selectedPostId = postId;
      this.wantAddPost = false;
      this.wantEditPost = false;
      this.isSidebarOpen = true;
    },
    closeForm() {
      this.wantEditPost = false;
    },
    closePost() {
      this.selectedPostId = null;
      this.isSidebarOpen = false;
      this.wantAddPost = false;
      this.wantEditPost = false;
    },
    deletePost(postId) {
      this.errorMessage = "";

      removePost(postId)
        .then(() => {
          this.posts = this.posts.filter((post) => post.id !== postId);
          this.closePost();
        })
        .catch(() => (this.errorMessage = "Unable to delete post"));
    },
    addPost() {
      this.wantAddPost = true;
      this.isSidebarOpen = true;
      this.selectedPostId = null;
    },
    setEditMode() {
      this.wantEditPost = true;
      this.wantAddPost = false;
      this.isSidebarOpen = true;
    },
    updatePost(updatedPost) {
      this.posts = this.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post,
      );

      this.wantEditPost = false;
    },
    createPost(newPost) {
      this.posts.unshift(newPost);
      this.openPost(newPost.id);
    },
    clearNotification() {
      this.errorMessage = "";
    },
  },
};
</script>

<template>
  <div class="ghost-wrapper">
    <template v-if="user">
      <Header :name="user.name" @logout="logOut" />
      <main class="section">
        <div class="container is-fluid">
          <Loader v-if="isLoading" />
          <Notification
            v-if="errorMessage"
            :errorMessage="errorMessage"
            @close="clearNotification"
          />
          <div class="columns">
            <PostList
              v-if="!isLoading && !errorMessage"
              :posts="posts"
              :selectedPostId="selectedPostId"
              @select="openPost"
              @close="closePost"
              @add="addPost"
              @edit="setEditMode"
            />

            <Sidebar :isSidebarOpen="isSidebarOpen">
              <AddPost
                v-if="wantAddPost"
                :userId="user.id"
                @cancel="closePost"
                @success="createPost"
              />
              <EditPost
                v-else-if="wantEditPost"
                :post="selectedPost"
                @cancel="closeForm"
                @success="updatePost"
              />
              <PostPreview
                v-else-if="selectedPost"
                :post="selectedPost"
                @remove="deletePost"
                @edit="setEditMode"
              />
            </Sidebar>
          </div>
        </div>
      </main>
    </template>
    <Login @login="onLogin" v-else />
  </div>
</template>

<style>
html,
body {
  display: block;
}

#app {
  display: block;
  padding: 0;
  margin: 0;
  max-width: none;
  width: 100%;
}
</style>

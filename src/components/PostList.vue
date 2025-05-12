<script>
import { deletePost, getPosts, updatePost } from "../api/posts";
import Loader from "./Loader.vue";
import PostItem from "./PostItem.vue";
import Sidebar from "./Sidebar.vue";
export default {
  name: "PostList",
  components: {
    PostItem,
    Loader,
    Sidebar,
  },
  props: {
    userId: Number,
  },
  data() {
    return {
      posts: [],
      selectedPost: {},
      loader: false,
      errorMessage: "",
      isActiveSidebar: false,
    };
  },
  mounted() {
    this.loader = true;
    getPosts()
      .then(({ data }) => {
        this.posts = data;
      })
      .catch(() => {
        this.errorMessage = "Can't download post";
      })
      .finally(() => {
        this.loader = false;
      });
  },
  methods: {
    handleCloseSidebar() {
      this.isActiveSidebar = false;
      this.loader;
    },
    handleOpenSidebar() {
      this.isActiveSidebar = true;
    },
    handleSelectPost(post) {
      this.selectedPost = { ...post };
      this.handleOpenSidebar();
    },
    handleResetPost() {
      setTimeout(() => {
        this.selectedPost = {};
      }, 500);
      this.isActiveSidebar = false;
    },
    deletePost(postId) {
      deletePost(postId).then(() => {
        this.posts = this.posts.filter((post) => post.id !== postId);
      });
      this.selectedPost = {};
      this.isActiveSidebar = false;
    },
    updatePost({ postId, title, body }) {
      updatePost({ postId, title, body }).then(({ data }) => {
        this.posts = this.posts.map((post) => {
          if (post.id !== postId) {
            return post;
          } else {
            this.selectedPost = { ...data };
            return { ...data };
          }
        });
      });
    },
  },
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button"
            :class="{
              'is-link': !(
                isActiveSidebar && !selectedPost.hasOwnProperty('id')
              ),
            }"
            @click="handleOpenSidebar"
          >
            Add New Post
          </button>
        </div>

        <Loader v-if="loader" />

        <div
          v-else-if="!loader && errorMessage"
          class="is-error is-danger notification"
        >
          {{ errorMessage }}
        </div>

        <div v-else-if="!loader && !errorMessage && !posts.length">
          No post's yet. Create your first post!
        </div>

        <table
          v-else
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <PostItem
              v-for="post of posts"
              :key="post.id"
              :post="post"
              :selectedPost="selectedPost"
              @selectPost="handleSelectPost"
              @resetPost="handleResetPost"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Sidebar
    :isActive="isActiveSidebar"
    :userId="userId"
    :selectedPost="selectedPost"
    @closeSidebar="handleCloseSidebar"
    @addPost="posts.push($event)"
    @deletePost="deletePost($event)"
    @updatePost="updatePost($event)"
  />
</template>
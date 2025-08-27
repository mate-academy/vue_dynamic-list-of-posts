<template>
  <div id="app">
    <PostsTable
      :posts="posts"
      :loading="loading"
      :error="error"
      @select="handleSelectPost"
      @create="handleCreatePost"
    />
    <Sidebar
      :open="sidebarOpen"
      :mode="sidebarMode"
      :post="selectedPost"
      :loading="sidebarLoading"
      :error="sidebarError"
      @edit="handleEditPost"
      @delete="handleDeletePost"
      @create-post="handleCreatePostSubmit"
      @edit-post="handleEditPostSubmit"
      @cancel="handleSidebarCancel"
    />
  </div>
</template>

<script>
import PostsTable from "./PostsTable.vue";
import Sidebar from "./Sidebar.vue";
import { fetchPosts, deletePost } from "./api.js";

export default {
  name: "App",
  components: { PostsTable, Sidebar },
  data() {
    return {
      posts: [],
      loading: false,
      error: "",
      sidebarOpen: false,
      sidebarMode: "", // 'create', 'view', 'edit'
      selectedPost: null,
      userId: 1, // TODO: Replace with actual logged-in user
      sidebarLoading: false,
      sidebarError: "",
    };
  },
  created() {
    this.loadPosts();
  },
  methods: {
    async loadPosts() {
      this.loading = true;
      this.error = "";
      try {
        this.posts = await fetchPosts(this.userId);
      } catch (err) {
        this.error = err.message || "Failed to load posts";
      } finally {
        this.loading = false;
      }
    },
    handleSelectPost(post) {
      this.selectedPost = post;
      this.sidebarOpen = true;
      this.sidebarMode = "view";
      this.sidebarError = "";
    },
    handleCreatePost() {
      this.selectedPost = null;
      this.sidebarOpen = true;
      this.sidebarMode = "create";
      this.sidebarError = "";
    },
    handleEditPost(post) {
      this.selectedPost = post;
      this.sidebarOpen = true;
      this.sidebarMode = "edit";
      this.sidebarError = "";
    },
    async handleDeletePost(post) {
      // Optimistically remove post
      this.posts = this.posts.filter((p) => p.id !== post.id);
      this.sidebarOpen = false;
      try {
        await deletePost(post.id);
      } catch (err) {
        this.error = err.message || "Failed to delete post";
        // Optionally reload posts or allow retry
        this.loadPosts();
      }
    },
    async handleCreatePostSubmit(postData) {
      this.sidebarLoading = true;
      this.sidebarError = "";
      try {
        const newPost = await (
          await import("./api.js")
        ).createPost({ userId: this.userId, ...postData });
        this.posts.push(newPost);
        this.selectedPost = newPost;
        this.sidebarMode = "view";
        this.sidebarOpen = true;
      } catch (err) {
        this.sidebarError = err.message || "Failed to create post";
      } finally {
        this.sidebarLoading = false;
      }
    },
    async handleEditPostSubmit(postData) {
      this.sidebarLoading = true;
      this.sidebarError = "";
      try {
        const updatedPost = await (
          await import("./api.js")
        ).updatePost(this.selectedPost.id, postData);
        // Update post in posts list
        const idx = this.posts.findIndex((p) => p.id === this.selectedPost.id);
        if (idx !== -1) this.posts[idx] = updatedPost;
        this.selectedPost = updatedPost;
        this.sidebarMode = "view";
      } catch (err) {
        this.sidebarError = err.message || "Failed to update post";
      } finally {
        this.sidebarLoading = false;
      }
    },
    handleSidebarCancel() {
      this.sidebarOpen = false;
      this.sidebarMode = "";
      this.selectedPost = null;
      this.sidebarError = "";
    },
  },
};
</script>

<style>
/* Custom styles if needed */
</style>

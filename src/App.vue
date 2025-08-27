import PostsList from "./components/PostsList.vue";

<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <h1 class="title">My Posts</h1>
        <button class="button is-primary" @click="openCreateForm">
          Create New Post
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="container">
        <!-- Loader -->
        <Loader v-if="loading" />

        <!-- Error Message -->
        <div v-else-if="error" class="notification is-danger">
          {{ error }}
        </div>

        <!-- No Posts -->
        <div v-else-if="posts.length === 0" class="notification is-warning">
          No posts yet
        </div>

        <!-- Posts List -->
        <PostsList v-else :posts="posts" @select-post="openPost" />
      </div>
    </main>

    <!-- Sidebar -->
    <Sidebar
      :is-open="isSidebarOpen"
      :current-post="currentPost"
      :editing-post="editingPost"
      @close="closeSidebar"
      @create-post="handleCreatePost"
      @update-post="handleUpdatePost"
      @delete-post="handleDeletePost"
      @edit-post="startEditing"
      @cancel-edit="cancelEditing"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Loader from "./components/Loader.vue";
import PostsList from "./components/PostsList.vue";
import Sidebar from "./components/Sidebar.vue";
import {
  getPosts,
  createPost as apiCreatePost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
} from "./api/posts";
import { getCurrentUser } from "./api/users";

export default {
  name: "App",
  components: {
    Loader,
    PostsList,
    Sidebar,
  },
  setup() {
    const posts = ref([]);
    const currentPost = ref(null);
    const editingPost = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const isSidebarOpen = ref(false);
    const currentUser = ref(null);

    // Load current user
    const loadCurrentUser = async () => {
      try {
        currentUser.value = await getCurrentUser();
      } catch (err) {
        console.error("Failed to load user:", err);
        error.value = "Failed to load user data";
      }
    };

    // Load posts
    const loadPosts = async () => {
      loading.value = true;
      error.value = null;

      try {
        if (currentUser.value) {
          posts.value = await getPosts(currentUser.value.id);
        }
      } catch (err) {
        error.value = "Failed to load posts";
        console.error("Error loading posts:", err);
      } finally {
        loading.value = false;
      }
    };

    // Open post in sidebar
    const openPost = (post) => {
      currentPost.value = post;
      editingPost.value = null;
      isSidebarOpen.value = true;
    };

    // Open create form
    const openCreateForm = () => {
      currentPost.value = null;
      editingPost.value = {
        title: "",
        body: "",
        userId: currentUser.value?.id || 1,
      };
      isSidebarOpen.value = true;
    };

    // Close sidebar
    const closeSidebar = () => {
      isSidebarOpen.value = false;
      currentPost.value = null;
      editingPost.value = null;
    };

    // Create new post
    const handleCreatePost = async (postData) => {
      try {
        const newPost = await apiCreatePost(postData);
        posts.value.unshift(newPost);
        currentPost.value = newPost;
        editingPost.value = null;
      } catch (err) {
        console.error("Error creating post:", err);
        error.value = "Failed to create post";
      }
    };

    // Update post
    const handleUpdatePost = async (postData) => {
      try {
        const updatedPost = await apiUpdatePost(postData.id, postData);
        const index = posts.value.findIndex((p) => p.id === updatedPost.id);
        if (index !== -1) {
          posts.value.splice(index, 1, updatedPost);
        }
        currentPost.value = updatedPost;
        editingPost.value = null;
      } catch (err) {
        console.error("Error updating post:", err);
        error.value = "Failed to update post";
      }
    };

    // Delete post
    const handleDeletePost = async (postId) => {
      try {
        await apiDeletePost(postId);
        posts.value = posts.value.filter((post) => post.id !== postId);
        closeSidebar();
      } catch (err) {
        console.error("Error deleting post:", err);
        error.value = "Failed to delete post";
      }
    };

    // Start editing
    const startEditing = () => {
      editingPost.value = { ...currentPost.value };
    };

    // Cancel editing
    const cancelEditing = () => {
      editingPost.value = null;
    };

    // Initialize app
    onMounted(async () => {
      await loadCurrentUser();
      await loadPosts();
    });

    return {
      posts,
      currentPost,
      editingPost,
      loading,
      error,
      isSidebarOpen,
      openPost,
      openCreateForm,
      closeSidebar,
      handleCreatePost,
      handleUpdatePost,
      handleDeletePost,
      startEditing,
      cancelEditing,
    };
  },
};
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #f5f5f5;
  padding: 1rem 0;
  border-bottom: 1px solid #dbdbdb;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.title {
  margin: 0;
  color: #363636;
}
</style>

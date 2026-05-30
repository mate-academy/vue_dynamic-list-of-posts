<template>
  <div>
    <nav
      class="navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-item">
        <h2 class="is-size-4">Vue List Of Posts</h2>
      </div>
      <div
        class="navbar-end"
        v-if="user"
      >
        <div class="navbar-item">
          <div class="buttons">
            <div class="mr-5 mb-2">
              <p>User: {{ user.name }}</p>
            </div>
            <a
              class="button is-light"
              @click="logout"
              >Logout</a
            >
          </div>
        </div>
      </div>
    </nav>

    <section
      v-if="!user"
      class="container is-flex is-justify-content-center"
    >
      <form
        @submit.prevent="handleLogin"
        class="box mt-5"
      >
        <h1 class="title is-3">Login to your account</h1>
        <div class="field">
          <label
            class="label"
            for="user-email"
            >Email</label
          >
          <div class="control has-icons-left">
            <input
              v-model="loginEmail"
              type="email"
              id="user-email"
              class="input"
              :class="{ 'is-danger': loginError }"
              placeholder="Enter your email"
              required
              @input="loginError = ''"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>
          </div>
          <p
            v-if="loginError"
            class="help is-danger"
          >
            {{ loginError }}
          </p>
        </div>
        <div class="field">
          <button
            type="submit"
            class="button is-primary"
            :class="{ 'is-loading': isLoggingIn }"
          >
            Login
          </button>
        </div>
      </form>
    </section>

    <main
      v-else
      class="section"
    >
      <div class="container">
        <div
          class="is-flex is-align-items-flex-start"
          style="gap: 24px; width: 100%"
        >
          <div
            :style="{
              width: isSidebarOpen ? 'calc(50% - 12px)' : '100%',
              flexShrink: 0,
              transition: 'all 0.4s ease-in-out',
            }"
          >
            <div
              v-if="isLoadingPosts"
              class="is-flex is-justify-content-center mt-5"
            >
              <Loader />
            </div>
            <div
              v-else-if="postsError"
              class="notification is-danger mt-3"
            >
              {{ postsError }}
            </div>
            <PostList
              v-else
              :posts="posts"
              :selected-post-id="selectedPost?.id"
              @open="openPost"
              @create="openCreate"
              @close="closeSidebar"
            />
          </div>

          <Sidebar :is-open="isSidebarOpen">
            <PostForm
              v-if="sidebarMode === 'create'"
              @save="handleCreatePost"
              @cancel="closeSidebar"
            />
            <PostForm
              v-else-if="sidebarMode === 'edit'"
              :initial-data="selectedPost"
              @save="handleUpdatePost"
              @cancel="sidebarMode = 'preview'"
            />
            <PostPreview
              v-else-if="sidebarMode === 'preview'"
              :post="selectedPost"
              @edit="sidebarMode = 'edit'"
              @delete="handleDeletePost"
            />
          </Sidebar>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  fetchPosts,
  getUserByEmail,
  createPost,
  updatePost,
  deletePost,
} from "./api.js";
import PostList from "./PostList.vue";
import Sidebar from "./Sidebar.vue";
import PostPreview from "./PostPreview.vue";
import PostForm from "./PostForm.vue";
import Loader from "./Loader.vue";

const savedUser = localStorage.getItem("currentUser");
const user = ref(savedUser ? JSON.parse(savedUser) : null);

const loginEmail = ref("");
const loginError = ref("");
const isLoggingIn = ref(false);

const posts = ref([]);
const isLoadingPosts = ref(false);
const postsError = ref("");

const isSidebarOpen = ref(false);
const sidebarMode = ref(null);
const selectedPost = ref(null);

const loadPostsFromServer = async (userId) => {
  isLoadingPosts.value = true;
  postsError.value = "";
  try {
    posts.value = await fetchPosts(userId);
  } catch (error) {
    postsError.value = "Failed to load posts";
  } finally {
    isLoadingPosts.value = false;
  }
};

onMounted(() => {
  if (user.value) {
    loadPostsFromServer(user.value.id);
  }
});

const handleLogin = async () => {
  if (!loginEmail.value) return;
  isLoggingIn.value = true;
  loginError.value = "";
  try {
    const existingUser = await getUserByEmail(loginEmail.value);
    if (existingUser) {
      user.value = existingUser;
      localStorage.setItem("currentUser", JSON.stringify(existingUser));

      await loadPostsFromServer(user.value.id);
    } else {
      loginError.value = "User not found. Please register.";
    }
  } catch (error) {
    loginError.value = "Network error during login.";
  } finally {
    isLoggingIn.value = false;
  }
};

const logout = () => {
  user.value = null;
  loginEmail.value = "";
  posts.value = [];
  closeSidebar();
  localStorage.removeItem("currentUser");
};

const openCreate = () => {
  selectedPost.value = null;
  sidebarMode.value = "create";
  isSidebarOpen.value = true;
};

const openPost = (post) => {
  selectedPost.value = post;
  sidebarMode.value = "preview";
  isSidebarOpen.value = true;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  setTimeout(() => {
    sidebarMode.value = null;
    selectedPost.value = null;
  }, 400);
};

const handleCreatePost = async (formData) => {
  try {
    const postData = { ...formData, userId: user.value.id };
    const newPost = await createPost(postData);
    posts.value.push(newPost);
    openPost(newPost);
  } catch (error) {
    alert("Failed to create post");
  }
};

const handleUpdatePost = async (formData) => {
  try {
    const updatedPost = await updatePost(formData.id, formData);
    const index = posts.value.findIndex((p) => p.id === formData.id);
    if (index !== -1) {
      posts.value[index] = updatedPost;
    }
    openPost(updatedPost);
  } catch (error) {
    alert("Failed to update post");
  }
};

const handleDeletePost = async (postId) => {
  try {
    await deletePost(postId);
    posts.value = posts.value.filter((p) => p.id !== postId);
    closeSidebar();
  } catch (error) {
    alert("Failed to delete post");
  }
};
</script>

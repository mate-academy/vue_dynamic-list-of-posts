<script setup>
import { ref, onMounted } from 'vue';
import { getPosts, createPost, deletePost } from './api/posts';
import { getUserByEmail } from './api/users';
import { getComments } from './api/comments';
import TheNavbar from './components/Layout/TheNavbar.vue';
import TheSidebar from './components/Layout/TheSidebar.vue';
import PostList from './components/Posts/PostList.vue';
import AppLoader from './components/Base/AppLoader.vue';
import LoginForm from './components/Auth/LoginForm.vue';

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);
const posts = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const isSidebarOpen = ref(false);
const selectedPost = ref(null);
const sidebarMode = ref('view');
const comments = ref([]);
const isCommentsLoading = ref(false);

const fetchPosts = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    posts.value = await getPosts(currentUser.value.id);
  } catch (error) {
    errorMessage.value = 'Failed to load posts. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const handleLogin = async (email) => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const users = await getUserByEmail(email);

    if (users.length > 0) {
      currentUser.value = users[0];
      localStorage.setItem('user', JSON.stringify(users[0]));
      await fetchPosts();
    } else {
      errorMessage.value = 'User not found. Please check your email.';
    }
  } catch (error) {
    errorMessage.value = `Login failed: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  currentUser.value = null;
  posts.value = [];
  errorMessage.value = '';
  localStorage.removeItem('user');
  isSidebarOpen.value = false;
};

const handlePostDelete = async (postId) => {
  isLoading.value = true;
  try {
    await deletePost(postId);

    posts.value = posts.value.filter((post) => post.id !== postId);

    isSidebarOpen.value = false;
    selectedPost.value = null;
  } catch (error) {
    errorMessage.value = 'Failed to delete the post.';
  } finally {
    isLoading.value = false;
  }
};

const openPost = async (post) => {
  sidebarMode.value = 'view';
  selectedPost.value = post;
  isSidebarOpen.value = true;

  comments.value = [];
  isCommentsLoading.value = true;

  try {
    comments.value = await getComments(post.id);
  } catch (error) {
    errorMessage.value = 'Could not load comments. Please try again.';
  } finally {
    isCommentsLoading.value = false;
  }
};

const openAddForm = () => {
  sidebarMode.value = 'add';
  selectedPost.value = null;
  isSidebarOpen.value = true;
};

const handlePostAdd = async (postData) => {
  isLoading.value = true;
  try {
    const newPost = await createPost(postData);

    posts.value = [newPost, ...posts.value];

    isSidebarOpen.value = false;
  } catch (error) {
    errorMessage.value = 'Failed to create the post.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (currentUser.value) {
    fetchPosts();
  }
});
</script>

<template>
  <template v-if="currentUser">
    <TheNavbar :user="currentUser" @logout="handleLogout" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostList
            :posts="posts"
            :selected-post-id="selectedPost?.id"
            @select="openPost"
            @add="openAddForm"
          />
          <TheSidebar
            :post="selectedPost"
            :is-open="isSidebarOpen"
            :mode="sidebarMode"
            :comments="comments"
            :is-loading-comments="isCommentsLoading"
            :user-id="currentUser.id"
            @close="isSidebarOpen = false"
            @save="handlePostAdd"
            @delete="handlePostDelete"
          />
        </div>
      </div>
    </main>
  </template>

  <div v-else class="container">
    <AppLoader v-if="isLoading" />
    <LoginForm v-else @login="handleLogin" />
  </div>
</template>

<style></style>

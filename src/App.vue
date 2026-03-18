<script setup>
import { ref, onMounted } from 'vue';
import { getPosts, createPost, deletePost, updatePost } from './api/posts';
import { getUserByEmail, createUser } from './api/users';
import { getComments, createComment, deleteComment } from './api/comments';
import TheNavbar from './components/Layout/TheNavbar.vue';
import TheSidebar from './components/Layout/TheSidebar.vue';
import PostList from './components/Posts/PostList.vue';
import AppLoader from './components/Base/AppLoader.vue';
import LoginForm from './components/Auth/LoginForm.vue';
import NeedToRegister from './components/Auth/NeedToRegister.vue';

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);
const posts = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const isSidebarOpen = ref(false);
const selectedPost = ref(null);
const sidebarMode = ref('view');
const comments = ref([]);
const isCommentsLoading = ref(false);
const isCommentSubmitting = ref(false);

const isRegistering = ref(false);
const registrationEmail = ref('');

const fetchPosts = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    posts.value = await getPosts(currentUser.value.id);
  } catch (error) {
    errorMessage.value = 'Failed to load posts';
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
      registrationEmail.value = email;
      isRegistering.value = true;
    }
  } catch (error) {
    errorMessage.value = 'Login failed';
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async (userData) => {
  isLoading.value = true;
  try {
    const newUser = await createUser(userData);
    currentUser.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    posts.value = [];
    isRegistering.value = false;
  } catch (error) {
    errorMessage.value = 'Registration failed';
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
  selectedPost.value = null;
  isRegistering.value = false;
};

const handlePostDelete = async (postId) => {
  errorMessage.value = '';
  const originalPosts = [...posts.value];
  const lastSelectedPost = selectedPost.value;

  posts.value = posts.value.filter((post) => post.id !== postId);
  isSidebarOpen.value = false;
  selectedPost.value = null;

  try {
    await deletePost(postId);
  } catch (error) {
    posts.value = originalPosts;
    selectedPost.value = lastSelectedPost;
    isSidebarOpen.value = true;
    errorMessage.value = 'Failed to delete the post';
  }
};

const openPost = async (post) => {
  if (
    selectedPost.value?.id === post.id &&
    isSidebarOpen.value &&
    sidebarMode.value === 'view'
  ) {
    isSidebarOpen.value = false;
    selectedPost.value = null;
    return;
  }

  sidebarMode.value = 'view';
  selectedPost.value = post;
  isSidebarOpen.value = true;
  comments.value = [];
  isCommentsLoading.value = true;
  errorMessage.value = '';

  try {
    comments.value = await getComments(post.id);
  } catch (error) {
    errorMessage.value = 'Comments loading error';
  } finally {
    isCommentsLoading.value = false;
  }
};

const handlePostSave = async (postData) => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    if (sidebarMode.value === 'edit') {
      const updatedPost = await updatePost(postData);
      const index = posts.value.findIndex((p) => p.id === updatedPost.id);
      if (index !== -1) posts.value[index] = updatedPost;
      selectedPost.value = updatedPost;
      sidebarMode.value = 'view';
    } else {
      const newPost = await createPost(postData);
      posts.value = [...posts.value, newPost];
      selectedPost.value = newPost;
      sidebarMode.value = 'view';
      comments.value = [];
    }
  } catch (error) {
    errorMessage.value = 'Failed to save post';
  } finally {
    isLoading.value = false;
  }
};

const handleCommentAdd = async (commentData) => {
  isCommentSubmitting.value = true;
  errorMessage.value = '';
  try {
    const newComment = await createComment(commentData);
    comments.value = [...comments.value, newComment];
  } catch (error) {
    errorMessage.value = 'Failed to add comment';
  } finally {
    isCommentSubmitting.value = false;
  }
};

const handleCommentDelete = async (commentId) => {
  const originalComments = [...comments.value];
  comments.value = comments.value.filter((c) => c.id !== commentId);

  try {
    await deleteComment(commentId);
  } catch (error) {
    comments.value = originalComments;
    errorMessage.value = 'Failed to delete comment';
  }
};

onMounted(() => {
  if (currentUser.value) fetchPosts();
});
</script>

<template>
  <template v-if="currentUser">
    <TheNavbar :user="currentUser" @logout="handleLogout" />

    <main class="section">
      <div class="container">
        <div v-if="errorMessage" class="notification is-danger">
          <button class="delete" @click="errorMessage = ''"></button>
          {{ errorMessage }}
        </div>

        <div class="tile is-ancestor">
          <PostList
            :posts="posts"
            :selected-post-id="selectedPost?.id"
            @select="openPost"
            @add="
              sidebarMode = 'add';
              isSidebarOpen = true;
              selectedPost = null;
            "
          />

          <TheSidebar
            v-if="isSidebarOpen"
            :post="selectedPost"
            :is-open="isSidebarOpen"
            :mode="sidebarMode"
            :comments="comments"
            :is-loading-comments="isCommentsLoading"
            :is-comment-submitting="isCommentSubmitting"
            :user-id="currentUser.id"
            @close="
              isSidebarOpen = false;
              selectedPost = null;
            "
            @save="handlePostSave"
            @edit="sidebarMode = 'edit'"
            @delete="handlePostDelete"
            @add-comment="handleCommentAdd"
            @delete-comment="handleCommentDelete"
          />
        </div>
      </div>
    </main>
  </template>

  <div v-else class="container">
    <AppLoader v-if="isLoading" />
    <template v-else>
      <NeedToRegister
        v-if="isRegistering"
        :email="registrationEmail"
        @register="handleRegister"
      />
      <LoginForm v-else @login="handleLogin" />
    </template>
  </div>
</template>

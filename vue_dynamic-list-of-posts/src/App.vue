<script setup>
import * as postApi from './api/posts';
import Header from './components/Header.vue';
import Login from './components/Login.vue';
import PostList from './components/postList.vue';
import Register from './components/Register.vue';
import { ref } from 'vue';
import SideBar from './components/SideBar.vue';

const currentUser = ref(null);
const pendingEmail = ref('');
const isSidebarOpen = ref(false);
const showRegister = ref(false);
const posts = ref([]);
const errorMessage = ref('');
const isLoading = ref(false);
const mode = ref(null);
const selectedPost = ref(null);

async function loadPosts(userId) {
  isLoading.value = true;

  try {
    posts.value = await postApi.getPosts(userId);
  } catch (error) {
    errorMessage.value = 'Unable to load posts';
  } finally {
    isLoading.value = false;
  }
}

async function addPost({ userId, title, body }) {
  if (!title) {
    errorMessage.value = 'Title should not be empty';
    return;
  }

  if (!body) {
    errorMessage.value = 'Message body should not be empty';
    return;
  }

  isLoading.value = true;

  try {
    const newPost = await postApi.createPost({ userId: currentUser.value.id, title, body });

    posts.value.push(newPost);
    errorMessage.value = '';
    selectedPost.value = newPost;
    isSidebarOpen.value = true;
    mode.value = 'view';
  } catch (error) {
    errorMessage.value = 'Unable to add a post';
  } finally {
    isLoading.value = false;
  }
}

async function deletePost(postId) {
  try {
    await postApi.deletePost(postId);
    posts.value = posts.value.filter(post => post.id !== postId);
    closeSidebar();
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = 'Unable to delete a post';
  }
}

async function updatePost({ id, userId, title, body }) {
  try {
    const updatedPost = await postApi.updatePost({ id, userId, title, body });
    const currentPost = posts.value.find(post => post.id === id);

    Object.assign(currentPost, updatedPost);
    selectedPost.value = updatedPost;
    isSidebarOpen.value = true;
    mode.value = 'view';
  } catch (error) {
    errorMessage.value = 'Unable to update a post';
  }
}

function onLogin(user) {
  currentUser.value = user;
  loadPosts(user.id);
}

function onRegisterRequest({ email }) {
  pendingEmail.value = email;
  showRegister.value = true;
}

function onRegistered(user) {
  currentUser.value = user;
  showRegister.value = false;
  loadPosts(user.id)
}

function onLogout() {
  currentUser.value = null;
  posts.value = [];
  isSidebarOpen.value = false;
}

function handleOpenSidebar({ mode: newMode, post = null }) {
  mode.value = newMode;
  selectedPost.value = post;
  isSidebarOpen.value = true;
}

function closeSidebar() {
  isSidebarOpen.value = false;
  selectedPost.value = null;
  mode.value = null;
}

function handleEditPost() {
  mode.value = 'edit';
}

</script>

<template>
  <div v-if="currentUser === null && showRegister === false">
    <Login @login="onLogin" @register="onRegisterRequest" />
  </div>
  <Register :email="pendingEmail" @registered="onRegistered" v-if="showRegister" />

  <Header :user="currentUser" @logout="onLogout" v-if="currentUser" />
  <main class="section" v-if="currentUser">
    <div class="container">
      <div class="tile-ancestor">
        <div class="posts" :class="{ 'posts--shrink': isSidebarOpen }">
          <PostList :posts="posts" :userId="currentUser?.id" :isLoading="isLoading" :errorMessage="errorMessage"
            :selectedPost="selectedPost" @open-sidebar="handleOpenSidebar" @close="closeSidebar" />
        </div>
        <Transition name="sidebar">
          <div class="sidebar" v-if="isSidebarOpen">
            <SideBar :open="isSidebarOpen" :mode="mode" :userId="currentUser?.id" :isLoading="isLoading"
              :post="selectedPost" :error="errorMessage" @close="closeSidebar" @create="addPost" @delete="deletePost"
              @update="updatePost" @edit="handleEditPost" />
          </div>
        </Transition>
      </div>
    </div>
  </main>
</template>
<style>
.tile-ancestor {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.posts {
  flex: 1 1 100%;
  transition: flex-basis 0.35s ease;
}

.posts--shrink {
  flex-basis: 50%;
}

.sidebar {
  flex: 0 0 50%;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-to,
.sidebar-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>

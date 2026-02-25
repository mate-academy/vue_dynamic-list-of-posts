<script setup>
import { ref } from 'vue';
import PostList from './components/PostList.vue';
import SideBar from './components/SideBar.vue';
import Login from './components/Login.vue';

// Стан додатку
const user = ref(null);
const isSideBarOpen = ref(false);
const selectedPost = ref(null);
const posts = ref([]);
const isLoading = ref(true);
const error = ref(null);

const BASE_URL = 'https://mate.academy/students-api';

// Завантаження постів користувача
async function fetchUserPosts(userId) {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await fetch(`${BASE_URL}/posts?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    posts.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

// Авторизація
async function handleLogin(newUser) {
  user.value = newUser;
  await fetchUserPosts(newUser.id);
}

// Вихід
function handleLogout() {
  user.value = null;
  posts.value = [];
  selectedPost.value = null;
  isSideBarOpen.value = false;
}

// Відкриття для створення нового поста
function openNewSideBar() {
  selectedPost.value = null;
  isSideBarOpen.value = true;
}

// ВИПРАВЛЕНО: Обробка вибору поста або натискання "Close"
function openPostSideBar(post) {
  selectedPost.value = post;
  
  if (post === null) {
    // Якщо прийшов null, закриваємо сайдбар
    isSideBarOpen.value = false;
  } else {
    // Якщо прийшов об'єкт поста, відкриваємо його
    isSideBarOpen.value = true;
  }
}

// Додавання нового поста (викликається з SideBar)
function addPost(post) {
  posts.value.push(post);
  selectedPost.value = post;
  isSideBarOpen.value = true;
}

// Оновлення існуючого поста
function updatePost(updatedPost) {
  const index = posts.value.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
  }
}

// Видалення поста
function deletePost(postId) {
  posts.value = posts.value.filter(p => p.id !== postId);
  isSideBarOpen.value = false;
  selectedPost.value = null;
}

</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-end" v-if="user">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ user?.name }}</p>
          </div>
          <button class="button is-light" @click="handleLogout">Logout</button>
        </div>
      </div>
    </div>
  </nav>

  <main class="section">
    <div class="container">
      <Login v-if="!user" @login="handleLogin" />

      <div v-else class="columns">
        <div class="column">
          <PostList 
            :posts="posts" 
            :isLoading="isLoading"
            :error="error"
            :selectedPost="selectedPost"
            @openNew="openNewSideBar"
            @selectedPost="openPostSideBar" 
          />
        </div>
        
        <div class="column is-one-third" v-if="isSideBarOpen">
          <SideBar 
            :isSideBarOpen="isSideBarOpen" 
            :selectedPost="selectedPost"
            :currentUser="user"
            @created="addPost"
            @save="updatePost"
            @delete="deletePost"
            @close="isSideBarOpen = false"
          />
        </div>
      </div>
    </div>
  </main>
</template>
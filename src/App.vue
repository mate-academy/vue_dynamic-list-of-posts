<script setup>
import { ref, onMounted } from 'vue'; 
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import PostsList from './components/PostsList.vue';
import { getPosts, createPost, updatePost, deletePost } from './api/posts.js';
import { getUsers } from './api/users.js';
import { createComment } from './api/comment.js';
import LoginModal from './components/LoginModal.vue';

const isLoading = ref(true);
const isSidebarOpen = ref(false);
const selectedPost = ref(null);
const users = ref([]);
const posts = ref([]);
const postError = ref(false);
const currentUser = ref(null);

const loadedData = async () => {
  isLoading.value = true;
  try {
    const [postsFromServer, usersFromServer] = await Promise.all([
      getPosts(),
      getUsers(),
    ]);

   posts.value = Array.isArray(postsFromServer) 
      ? postsFromServer 
      : postsFromServer.data || [];

    users.value = Array.isArray(usersFromServer) 
      ? usersFromServer 
      : usersFromServer.data || [];
  } catch (error) {
    postError.value = true;
    console.error('Помилка при завантаженні:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
    loadedData();
  });

const handleCreatePost = async (newPostData) => {
  try {
    const newPost = await createPost(newPostData);

    posts.value = [newPost, ...posts.value];

    selectedPost.value = newPost;
    isSidebarOpen.value = true;
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};

const handleOpenPost = (post) => {
  if (selectedPost.value && selectedPost.value.id === post.id) {
    isSidebarOpen.value = false;
    selectedPost.value = null;
  } else {
    selectedPost.value = post;
    isSidebarOpen.value = true;
  }
};

const handleDelete = async (postId) => {
  try {
    await deletePost(postId);

    isSidebarOpen.value = false;
    selectedPost.value = null;
    posts.value = posts.value.filter(p => p.id !== postId);

  } catch (error) {
    console.error('Помилка при видаленні:', error);
  }
};

const handleUpdate = async (postId, newFields) => {
  try {
    const updatedPost = await updatePost(postId, newFields);

    const index = posts.value.findIndex(p => p.id === postId);

    if (index !== -1) {
      posts.value[index] = updatedPost;
    }

    isSidebarOpen.value = true;
    selectedPost.value = updatedPost;
  } catch (error) {
    console.error('Помилка при оновленні:', error);
  }
};

const handleCreateComment = async (data) => {
  try {
    await createComment(data);
  } catch (error) {
    console.error('Помилка при створенні коментаря:', error);
  }
};

const handleLogin = (userData) => {
  const foundUser = users.value.find(user => user.email === userData.email);

  if (foundUser) {
    currentUser.value = foundUser;
  }
};

const handleLogout = () => {
  currentUser.value = null;
};
</script>

<template>
  <div class="root">
    <template v-if="currentUser">
      <Navbar :user="currentUser" @logout="handleLogout" />
 
      <main class="section">
        <div class="container">
          <div class="tile is-ancestor">
            <div class="dashboard-layout">
              <PostsList 
                :is-loading="isLoading"
                :post-error="postError"
                :is-sidebar-open="isSidebarOpen"
                :selected-post="selectedPost"
                @open-sidebar="isSidebarOpen = true; selectedPost = null" 
                :posts="posts" 
                @open-post="handleOpenPost"
              />

              <Sidebar 
                v-if="isSidebarOpen" 
                :is-open="isSidebarOpen"
                :selected-post="selectedPost"
                @create-post="handleCreatePost"
                @close-sidebar="isSidebarOpen = false"
                @delete="handleDelete"
                @update="handleUpdate"
                @create-comment="handleCreateComment"
              />
             </div>
            </div>
          </div>
        </main>
      </template>
     <LoginModal v-else @login="handleLogin"/>
  </div>
</template>

<style>
.dashboard-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: stretch;
}

.dashboard-layout > *:first-child {
  flex: 1; /* Таблиця займає увесь вільний простір */
  transition: all 0.3s ease;
  width: 100%;
}

.Sidebar {
  flex: 1; /* Сайдбар займає другу половину (~50%) */
  max-width: 50%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* Якщо сайдбар закритий, повністю ховаємо його з потоку */
.Sidebar:not(.Sidebar--open) {
  display: none; 
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #c0c0c0;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #c0c0c0 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

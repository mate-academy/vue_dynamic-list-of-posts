<script>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PostsList from './components/PostsList.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    PostsList,
    Sidebar
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isSidebarOpen = ref(false)
    const selectedPost = ref(null)
    const postsList = ref(null)
    const isAuth = ref(!!localStorage.getItem('token'))
    const homeViewRef = ref(null)

    // Слідкуємо за зміною маршруту і localStorage
    watch(
      () => route.fullPath,
      () => {
        isAuth.value = !!localStorage.getItem('token')
      }
    )

    const handleOpenPost = (post) => {
      selectedPost.value = post
      isSidebarOpen.value = true
    }

    const handleEditPost = (post) => {
      selectedPost.value = post
      isSidebarOpen.value = true
    }

    const handleCreateNewPost = () => {
      selectedPost.value = null
      isSidebarOpen.value = true
    }

    const handleCloseSidebar = () => {
      isSidebarOpen.value = false
      selectedPost.value = null
    }

    const handlePostUpdate = () => {
      if (postsList.value) {
        postsList.value.refreshPosts()
      }
    }

    const logout = () => {
      localStorage.removeItem('token')
      isAuth.value = false
      router.push('/login')
    }

    return {
      isSidebarOpen,
      selectedPost,
      postsList,
      isAuth,
      handleOpenPost,
      handleEditPost,
      handleCreateNewPost,
      handleCloseSidebar,
      handlePostUpdate,
      logout,
      homeViewRef
    }
  }
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="container header-flex">
        <div></div>
        <div class="header-actions">
          <button v-if="$route.name !== 'login'" class="button is-primary" @click="handleCreateNewPost">
            Створити новий пост
          </button>
          <button v-if="isAuth" class="button is-light ml-3" @click="logout">
            <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
            <span>Вийти</span>
          </button>
        </div>
      </div>
    </header>

    <main class="main">
      <router-view
        :is-sidebar-open="isSidebarOpen"
        :selected-post="selectedPost"
        @open-post="handleOpenPost"
        @edit-post="handleEditPost"
        @close-sidebar="handleCloseSidebar"
        @post-updated="handlePostUpdate"
      />
    </main>

    <Sidebar
      v-if="isAuth && $route.name !== 'login'"
      :is-open="isSidebarOpen"
      :post="selectedPost"
      @close="handleCloseSidebar"
      @post-updated="handlePostUpdate"
    />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: white;
  padding: 1rem;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
  margin-bottom: 2rem;
}

.header-flex {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main {
  padding: 0 1rem;
}

@media (max-width: 600px) {
  .header-flex, .header-actions {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}
</style>

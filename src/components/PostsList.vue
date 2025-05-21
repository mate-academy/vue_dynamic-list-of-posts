<template>
  <div class="posts-list">
    <div v-if="loading" class="has-text-centered">
      <div class="loader"></div>
    </div>

    <div v-else-if="error" class="notification is-danger is-light is-flex is-align-items-center is-justify-content-space-between">
      <span>{{ error }}</span>
      <button class="delete ml-3" @click="error = null" aria-label="Закрити"></button>
    </div>

    <div v-else-if="posts.length === 0" class="notification">
      Немає постів
    </div>

    <div v-else>
      <div class="container">
        <div class="columns is-multiline">
          <div v-for="post in paginatedPosts" :key="post.id" class="column is-4">
            <div class="card">
              <div class="card-content">
                <p class="title is-4 has-text-info post-title" :title="post.title">
                  {{ post.title || 'Без назви' }}
                </p>
                <p class="subtitle is-6 has-text-grey-dark post-body" :title="post.body">
                  {{ post.body || 'Тут буде текст поста...' }}
                </p>
              </div>
              <footer class="card-footer">
                <a @click="openPost(post)" class="card-footer-item has-text-info" title="Відкрити">
                  <span class="icon action-icon">
                    <i class="fas fa-eye"></i>
                  </span>
                </a>
                <a @click="editPost(post)" class="card-footer-item has-text-warning" title="Редагувати">
                  <span class="icon action-icon">
                    <i class="fas fa-edit"></i>
                  </span>
                </a>
                <a @click="deletePost(post.id)" class="card-footer-item has-text-danger" title="Видалити">
                  <span class="icon action-icon">
                    <i class="fas fa-trash"></i>
                  </span>
                </a>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <nav class="pagination is-centered mt-5" role="navigation" aria-label="pagination">
        <button 
          class="pagination-previous button is-info"
          :class="{ 'is-light': currentPage === 1, 'is-disabled': currentPage === 1 }"
          :disabled="currentPage === 1"
          @click="goToPrevPage"
        >
          <span class="icon">
            <i class="fas fa-chevron-left"></i>
          </span>
          <span>Попередня</span>
        </button>
        <button 
          class="pagination-next button is-info"
          :class="{ 'is-light': currentPage >= totalPages, 'is-disabled': currentPage >= totalPages }"
          :disabled="currentPage >= totalPages"
          @click="goToNextPage"
        >
          <span>Наступна</span>
          <span class="icon">
            <i class="fas fa-chevron-right"></i>
          </span>
        </button>
        <ul class="pagination-list">
          <li v-for="page in displayedPages" :key="page">
            <a 
              class="pagination-link button" 
              :class="{ 
                'is-info': page === currentPage,
                'is-light': page !== currentPage
              }"
              @click="setPage(page)"
            >
              {{ page }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'https://mate-academy.github.io/fe-students-api'
const POSTS_PER_PAGE = 6
const MAX_VISIBLE_PAGES = 5

export default {
  name: 'PostsList',
  emits: ['open-post', 'edit-post'],
  setup(props, { emit }) {
    const posts = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)

    const totalPages = computed(() => Math.ceil(posts.value.length / POSTS_PER_PAGE))

    const displayedPages = computed(() => {
      const pages = []
      const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2)
      
      let start = Math.max(1, currentPage.value - halfVisible)
      let end = Math.min(totalPages.value, start + MAX_VISIBLE_PAGES - 1)
      
      if (end - start + 1 < MAX_VISIBLE_PAGES) {
        start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    const paginatedPosts = computed(() => {
      const start = (currentPage.value - 1) * POSTS_PER_PAGE
      const end = start + POSTS_PER_PAGE
      return posts.value.slice(start, end)
    })

    const fetchPosts = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await axios.get(`${API_URL}/posts`)
        if (response.data) {
          posts.value = response.data
        } else {
          error.value = 'Не вдалося отримати дані'
        }
      } catch (e) {
        console.error('Помилка завантаження постів:', e)
        error.value = e.response?.data?.message || 'Помилка завантаження постів'
      } finally {
        loading.value = false
      }
    }

    const openPost = (post) => {
      error.value = null
      emit('open-post', post)
    }

    const editPost = (post) => {
      error.value = null
      emit('edit-post', post)
    }

    const deletePost = async (postId) => {
      error.value = null
      try {
        await axios.delete(`${API_URL}/posts/${postId}`)
        posts.value = posts.value.filter(post => post.id !== postId)
        // Якщо поточна сторінка стала порожньою, переходимо на попередню
        if (paginatedPosts.value.length === 0 && currentPage.value > 1) {
          currentPage.value--
        }
      } catch (e) {
        console.error('Помилка видалення поста:', e)
        error.value = 'Не вдалося видалити пост'
      }
    }

    const goToPrevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const setPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    onMounted(fetchPosts)

    return {
      posts,
      loading,
      error,
      currentPage,
      totalPages,
      displayedPages,
      paginatedPosts,
      openPost,
      editPost,
      deletePost,
      goToPrevPage,
      goToNextPage,
      setPage,
      refreshPosts: fetchPosts
    }
  }
}
</script>

<style scoped>
.posts-list {
  padding: 20px;
}

.card {
  height: 100%;
  transition: transform 0.2s;
  border: 1px solid #f0f0f0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

.post-title {
  margin-bottom: 1rem !important;
  color: #3273dc !important;
  font-weight: 700;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-body {
  flex-grow: 1;
  color: #4a4a4a !important;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  min-height: 3.5em;
}

.card-footer {
  border-top: 1px solid #eaeaea;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0;
}

.card-footer-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  border: none !important;
  background: transparent;
  cursor: pointer;
  padding: 0.8rem 0;
  transition: background-color 0.2s, color 0.2s, transform 0.15s;
}

.card-footer-item:hover .action-icon {
  transform: scale(1.2);
  filter: brightness(1.2);
}

.action-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3273dc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination {
  margin-top: 2rem;
}

.pagination-link.button.is-info {
  background-color: #3273dc;
  border-color: #3273dc;
  color: white;
}

.pagination-link.button.is-info:hover {
  background-color: #2366d1;
  border-color: #2366d1;
}

.pagination-link.button.is-light {
  background-color: #f5f5f5;
  border-color: #dbdbdb;
  color: #363636;
}

.pagination-link.button.is-light:hover {
  background-color: #e8e8e8;
  border-color: #dbdbdb;
  color: #363636;
}

.button.is-info {
  background-color: #3273dc;
  border-color: #3273dc;
  color: white;
}

.button.is-info:hover {
  background-color: #2366d1;
  border-color: #2366d1;
}

.button.is-info.is-light {
  background-color: #ebf5ff;
  border-color: #3273dc;
  color: #3273dc;
}

.button.is-info.is-light:hover {
  background-color: #d4e7ff;
  border-color: #3273dc;
  color: #3273dc;
}

.button.is-disabled,
.button[disabled] {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 
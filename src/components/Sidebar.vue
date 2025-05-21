<template>
  <transition name="sidebar-slide">
    <div v-show="isOpen" class="sidebar">
      <div class="sidebar-accent"></div>
      <div class="sidebar-content sidebar-fade" :class="{ 'sidebar-content-visible': isOpen }">
        <button class="close-btn" @click="close" aria-label="Закрити">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="11" fill="currentColor"/>
            <path d="M7 7L15 15M15 7L7 15" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div>
          <div v-if="loading" class="has-text-centered">
            <div class="loader"></div>
          </div>
          <div v-else-if="error" class="notification is-danger">
            {{ error }}
          </div>
          <template v-else>
            <PostForm
              v-if="!post || isEditing"
              :post="post"
              @submit="handlePostSubmit"
              @cancel="close"
            />
            <template v-else>
              <div class="post-details">
                <h2 class="title is-4">{{ post.title }}</h2>
                <p class="subtitle is-6">{{ post.body }}</p>
                <button class="button is-info" @click="startEditing">
                  Редагувати
                </button>
              </div>
              <div class="comments-section">
                <h3 class="title is-5">Коментарі</h3>
                <div v-if="comments.length === 0" class="notification">
                  Немає коментарів
                </div>
                <div v-else class="comments-list">
                  <div v-for="comment in comments" :key="comment.id" class="comment">
                    <div class="box">
                      <p class="has-text-weight-bold">{{ comment.name }}</p>
                      <p class="has-text-grey">{{ comment.email }}</p>
                      <p>{{ comment.body }}</p>
                      <button class="delete is-small" @click="deleteComment(comment.id)"></button>
                    </div>
                  </div>
                </div>
                <button 
                  v-if="!showCommentForm" 
                  class="button is-primary"
                  @click="showCommentForm = true"
                >
                  Написати коментар
                </button>
                <div v-else class="comment-form">
                  <form @submit.prevent="submitComment">
                    <div class="field">
                      <label class="label">Ім'я</label>
                      <div class="control">
                        <input 
                          v-model="commentForm.name" 
                          class="input" 
                          type="text" 
                          placeholder="Ваше ім'я"
                        >
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Email</label>
                      <div class="control">
                        <input 
                          v-model="commentForm.email" 
                          class="input" 
                          type="email" 
                          placeholder="Ваш email"
                        >
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Коментар</label>
                      <div class="control">
                        <textarea 
                          v-model="commentForm.body" 
                          class="textarea" 
                          placeholder="Ваш коментар"
                        ></textarea>
                      </div>
                    </div>
                    <div class="field is-grouped">
                      <div class="control">
                        <button 
                          class="button is-primary is-light" 
                          :class="{ 'is-loading': submitting }"
                          type="submit"
                        >
                          Відправити
                        </button>
                      </div>
                      <div class="control">
                        <button class="button is-light" type="button" @click="clearForm">
                          Очистити
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, watch } from 'vue'
import axios from 'axios'
import PostForm from './PostForm.vue'

const API_URL = 'https://mate-academy.github.io/fe-students-api'

export default {
  name: 'Sidebar',
  components: {
    PostForm
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
      validator: (value) => typeof value === 'boolean'
    },
    post: {
      type: Object,
      default: null,
      validator: (value) => value === null || typeof value === 'object'
    }
  },
  emits: ['close', 'post-updated'],
  setup(props, { emit }) {
    const comments = ref([])
    const loading = ref(false)
    const error = ref(null)
    const showCommentForm = ref(false)
    const submitting = ref(false)
    const isEditing = ref(false)
    const commentForm = ref({
      name: '',
      email: '',
      body: ''
    })

    const fetchComments = async () => {
      if (!props.post) return
      
      loading.value = true
      error.value = null
      try {
        const response = await axios.get(`${API_URL}/comments?postId=${props.post.id}`)
        if (response.data) {
          comments.value = response.data
        } else {
          error.value = 'Не вдалося отримати коментарі'
        }
      } catch (e) {
        console.error('Помилка завантаження коментарів:', e)
        error.value = e.response?.data?.message || 'Помилка завантаження коментарів'
      } finally {
        loading.value = false
      }
    }

    const submitComment = async () => {
      if (!validateCommentForm()) return

      submitting.value = true
      try {
        const response = await axios.post(`${API_URL}/comments`, {
          ...commentForm.value,
          postId: props.post.id
        })
        if (response.data) {
          comments.value.push(response.data)
          commentForm.value.body = ''
        } else {
          error.value = 'Не вдалося додати коментар'
        }
      } catch (e) {
        console.error('Помилка додавання коментаря:', e)
        error.value = 'Не вдалося додати коментар'
      } finally {
        submitting.value = false
      }
    }

    const deleteComment = async (commentId) => {
      try {
        await axios.delete(`${API_URL}/comments/${commentId}`)
        comments.value = comments.value.filter(comment => comment.id !== commentId)
      } catch (e) {
        console.error('Помилка видалення коментаря:', e)
        error.value = 'Не вдалося видалити коментар'
      }
    }

    const validateCommentForm = () => {
      if (!commentForm.value.name.trim()) {
        error.value = 'Ім\'я обов\'язкове'
        return false
      }
      if (!commentForm.value.email.trim()) {
        error.value = 'Email обов\'язковий'
        return false
      }
      if (!commentForm.value.body.trim()) {
        error.value = 'Текст коментаря обов\'язковий'
        return false
      }
      return true
    }

    const clearForm = () => {
      commentForm.value = {
        name: '',
        email: '',
        body: ''
      }
      error.value = null
    }

    const close = () => {
      emit('close')
      showCommentForm.value = false
      isEditing.value = false
      error.value = null
    }

    const startEditing = () => {
      isEditing.value = true
    }

    const handlePostSubmit = (post) => {
      isEditing.value = false
      emit('post-updated', post)
    }

    watch(() => props.post, () => {
      if (props.post) {
        fetchComments()
      }
    })

    return {
      comments,
      loading,
      error,
      showCommentForm,
      submitting,
      isEditing,
      commentForm,
      submitComment,
      deleteComment,
      clearForm,
      close,
      startEditing,
      handlePostSubmit
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f5f8ff 0%, #eaf0fb 100%);
  box-shadow: -8px 0 32px 0 rgba(50, 115, 220, 0.12), -2px 0 8px 0 rgba(0,0,0,0.04);
  border-radius: 18px 0 0 18px;
  z-index: 1000;
  overflow: hidden;
  color: #23272f;
  display: flex;
  flex-direction: column;
}
.sidebar-content {
  opacity: 0;
  transition: opacity 0.35s 0.15s;
}
.sidebar-content-visible {
  opacity: 1;
}
.sidebar-slide-enter-active, .sidebar-slide-leave-active {
  transition: transform 0.35s cubic-bezier(.4,2,.6,1), box-shadow 0.25s;
}
.sidebar-slide-enter-from, .sidebar-slide-leave-to {
  transform: translateX(100%);
  box-shadow: none;
}
.sidebar-slide-enter-to, .sidebar-slide-leave-from {
  transform: translateX(0);
}
.sidebar-accent {
  height: 6px;
  width: 100%;
  background: linear-gradient(90deg, #3273dc 0%, #48c6ef 100%);
  margin-bottom: 18px;
}

.sidebar-content {
  padding: 32px 24px 24px 24px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  color: #23272f;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #ff3860;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 56, 96, 0.13);
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  z-index: 10;
  padding: 0;
}
.close-btn:hover {
  background: #d90429;
  color: #fff;
  box-shadow: 0 4px 16px rgba(255, 56, 96, 0.22);
}
.close-btn svg {
  display: block;
}

.post-details {
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(50, 115, 220, 0.07);
  padding: 1.2rem 1rem 1rem 1rem;
}

.comments-section {
  margin-top: 20px;
  background: #eaf4fd;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(50, 115, 220, 0.09);
  padding: 1.2rem 1rem 1rem 1rem;
  color: #23272f;
}

.comments-list {
  margin-bottom: 1rem;
}

.comment .box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(50, 115, 220, 0.04);
  margin-bottom: 10px;
  padding: 0.7rem 1rem;
  color: #23272f;
}

.button.is-info, .button.is-primary, .button.is-light {
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.button.is-info, .button.is-primary {
  background: linear-gradient(90deg, #3273dc 0%, #48c6ef 100%);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(50, 115, 220, 0.09);
}
.button.is-info:hover, .button.is-primary:hover {
  box-shadow: 0 2px 12px rgba(50, 115, 220, 0.18);
  filter: brightness(1.07);
}

.comment-form {
  margin-top: 1rem;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(50, 115, 220, 0.04);
  color: #23272f;
}

@media (max-width: 600px) {
  .sidebar {
    width: 100vw;
    border-radius: 0;
  }
  .sidebar-content {
    padding: 18px 8px 8px 8px;
  }
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 
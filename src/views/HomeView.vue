<template>
  <div class="home">
    <h1 class="title home-title">Список постів</h1>
    <PostsList
      ref="postsList"
      @open-post="openPost"
      @edit-post="editPost"
    />

    <Sidebar
      :is-open="isSidebarOpen"
      :post="selectedPost"
      @close="closeSidebar"
      @post-updated="handlePostUpdate"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import PostsList from '../components/PostsList.vue'
import Sidebar from '../components/Sidebar.vue'

export default {
  name: 'HomeView',
  components: {
    PostsList,
    Sidebar
  },
  props: {
    isSidebarOpen: {
      type: Boolean,
      required: true,
      validator: (value) => typeof value === 'boolean'
    },
    selectedPost: {
      type: Object,
      default: null,
      validator: (value) => value === null || typeof value === 'object'
    }
  },
  emits: ['open-post', 'edit-post', 'open-new-post', 'close-sidebar', 'post-updated'],
  setup(props, { emit }) {
    const postsList = ref(null)

    const openPost = (post) => {
      emit('open-post', post)
    }

    const editPost = (post) => {
      emit('edit-post', post)
    }

    const openNewPost = () => {
      emit('open-new-post')
    }

    const closeSidebar = () => {
      emit('close-sidebar')
    }

    const handlePostUpdate = () => {
      emit('post-updated')
    }

    return {
      postsList,
      openPost,
      editPost,
      openNewPost,
      closeSidebar,
      handlePostUpdate
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.home-title {
  color: #222 !important;
  font-weight: 800;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.01em;
}
</style> 
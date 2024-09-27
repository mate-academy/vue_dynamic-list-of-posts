<script setup>
import { ref, onMounted } from 'vue'
import { getPostsByUserId, deletePost, addPost, updatePost } from '@/api/posts'
import PostsItem from './PostsItem.vue'
import Loader from './Loader.vue'
import SideBar from './SideBar.vue'

const { userId } = defineProps({
  userId: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  }
})

const posts = ref([])
const selectedPost = ref({})
const editedPost = ref({})
const state = ref('success')
const isSidebarOpen = ref(false)
const isFormOpen = ref(false)
const formName = ref('')

onMounted(() => {
  state.value = 'loading'
  getPostsByUserId(userId)
    .then(({ data }) => {
      posts.value = data
    })
    .then(() => {
      state.value = 'success'
      console.log('success')
    })
    .catch(() => {
      state.value = 'error'
      console.log('error')
    })
})

const handleOpenSidebar = () => {
  isSidebarOpen.value = true
}

const handleCloseSidebar = () => {
  isSidebarOpen.value = false
}

const handleSelectPost = (post) => {
  selectedPost.value = post
  isFormOpen.value = false
  handleOpenSidebar()
}

const handeDeselectPost = () => {
  handleCloseSidebar()
  selectedPost.value = {}
}

const handleDeletePost = (postId) => {
  deletePost(postId).then(() => {
    posts.value = posts.value.filter((post) => post.id !== postId)

    handeDeselectPost()
  })
}

const handleAddPost = ({ title, body }) => {
  addPost({ userId, title, body }).then(({ data }) => {
    isFormOpen.value = false
    posts.value.push(data)
    handleSelectPost(data)
  })
}

const handleUpdatePost = ({ id, title, body }) => {
  updatePost({ id, title, body }).then(({ data }) => {
    posts.value = posts.value.map((post) => {
      if (post.id === id) {
        return data
      }
      return post
    })
    isFormOpen.value = false
    handleSelectPost(data)
  })
}

const handleOpenEditPostForm = () => {
  editedPost.value = selectedPost.value
  formName.value = 'editPost'
  selectedPost.value = {}
  isFormOpen.value = true
}
const handleOpenNewPostForm = () => {
  formName.value = 'addPost'
  selectedPost.value = {}
  isFormOpen.value = true
  handleOpenSidebar()
}

const handleCloseForm = () => {
  isFormOpen.value = false
  handeDeselectPost()
}
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :class="{ 'is-light': isSidebarOpen && !selectedPost.id }"
            @click="handleOpenNewPostForm"
          >
            Add New Post
          </button>
        </div>

        <Loader v-if="state === 'loading'" />

        <div v-else-if="state === 'error'" class="notification is-danger">
          Failed to load posts. Please reload the page.
        </div>
        <div v-else-if="state === 'success' && !posts.length" class="">No posts yet.</div>

        <table
          v-if="state === 'success' && posts.length"
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <PostsItem
              v-for="post in posts"
              :key="post.id"
              :post
              :selectedPost
              @selectPost="handleSelectPost"
              @deselectPost="handeDeselectPost"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <SideBar
    :isSidebarOpen
    :isFormOpen
    :formName
    :editedPost
    :selectedPost
    @deletePost="handleDeletePost"
    @selectPost="handleSelectPost"
    @openForm="handleOpenEditPostForm"
    @closeForm="handleCloseForm"
    @addPost="handleAddPost"
    @updatePost="handleUpdatePost"
  />
</template>

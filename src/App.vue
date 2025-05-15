<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import PostList from './components/PostList.vue'
import SideBar from './components/SideBar.vue'
import { logInUser } from './api/user'
import { createNewPost, deletePost, editPost, getPostByIdApi, getPostsApi } from './api/posts'
import LoaderComponent from './components/LoaderComponent.vue'
import ErrorModal from './components/ErrorModal.vue'
import AddNewPost from './components/AddNewPost.vue'
import PostEditing from './components/PostEditing.vue'
import { clearUser, getUser, setUser } from './utils/localStorage'
import LogIn from './components/LogIn.vue'

const user = ref('')
const posts = ref([])
const activePostId = ref(null)
const postToEdit = ref(null)
const activePost = ref(null)
const isCreatingPost = ref(false)
const isEditingPost = ref(false)
const loading = ref(false)
const error = ref('')
const logInError = ref('')
const loggedIn = ref(false)

onBeforeMount(() => {
  error.value = ''
  checkIfLoggedIn()
})

watch(loggedIn, () => {
  checkIfLoggedIn()
})

function checkIfLoggedIn() {
  const localUser = getUser()

  if (
    localUser &&
    Object.keys(localUser).includes('id') &&
    Object.keys(localUser).includes('email')
  ) {
    user.value = localUser
    loggedIn.value = true
    getAllPosts()
  } else {
    loggedIn.value = false
  }
}

async function setActivePost(id) {
  try {
    activePost.value = null
    postToEdit.value = null
    isCreatingPost.value = false
    isEditingPost.value = false

    activePostId.value = id
    const postData = await getPostByIdApi(id)

    activePost.value = postData || null
  } catch (error) {
    console.error(error)
  }
}

function getAllPosts() {
  loading.value = true
  error.value = ''
  getPostsApi()
    .then((res) => {
      if (res && Array.isArray(res)) {
        posts.value = res

        activePost.value = null
        postToEdit.value = null
        isCreatingPost.value = false
        isEditingPost.value = false
      }
    })
    .catch((e) => {
      error.value = e.message
    })
    .finally(() => {
      loading.value = false
    })
}

function handleClose() {
  activePost.value = null
  activePostId.value = null
}

function showCreateNewMessage() {
  handleClose()
  isCreatingPost.value = true
  isEditingPost.value = false
}

function handleCreateNewMessage({ title, body }) {
  if (title && body) {
    loading.value = true
    createNewPost(user.value.id, title, body)
      .then(() => getAllPosts())
      .catch((e) => (error.value = e.message))
      .finally(() => {
        loading.value = false
        isCreatingPost.value = false
      })
  } else {
    console.error('Title or Message is empty')
  }
}

function handlePostDelete(id) {
  loading.value = true
  handleClose()

  deletePost(id)
    .then(() => getAllPosts())
    .catch((e) => (error.value = e.message))
    .finally(() => {
      loading.value = false
      isCreatingPost.value = false
    })
}

function handleShowEditing() {
  postToEdit.value = activePost.value
  handleClose()
  isEditingPost.value = true
}

function handlePostEdit(newPost) {
  postToEdit.value.title = newPost.title
  postToEdit.value.body = newPost.body
  loading.value = true
  editPost(user.value.id, postToEdit.value)
    .then(() => {
      handleClose()
      getAllPosts()
    })
    .catch((e) => (error.value = e.message))
    .finally(() => {
      loading.value = false
      isCreatingPost.value = false
    })
}

function handleLogIn(email) {
  logInError.value = ''
  loading.value = true
  logInUser(email)
    .then((res) => {
      if (res.data.length < 1) {
        logInError.value = 'Please register you account'
        return
      }

      setUser(res.data[0])
      loggedIn.value = true
    })
    .catch(() => (error.value = 'Login error'))
    .then(() => {
      loading.value = false
    })
}

function handleLogOut() {
  loggedIn.value = false
  clearUser()
}
</script>

<template>
  <div v-if="error">
    <ErrorModal :message="error" @close="error = ''" />
  </div>

  <div v-else-if="!loggedIn">
    <LogIn :error="logInError" @submit="handleLogIn" />
  </div>
  <div v-else>
    <AppHeader class="navbar" :userName="user && user.name" @logOut="handleLogOut" />

    <div v-if="loading">
      <LoaderComponent />
    </div>

    <div v-else class="section">
      <div class="tile is-ancestor">
        <div class="posts-list-container" :class="{ 'posts-list--shrunk': activePostId }">
          <PostList
            :active="activePostId"
            :posts="posts"
            @close="handleClose()"
            @open="setActivePost($event)"
            @create="showCreateNewMessage()"
          />
        </div>

        <SideBar
          v-if="activePost"
          :activePost="activePost"
          @edit="handleShowEditing"
          @delete="handlePostDelete"
        />

        <AddNewPost
          v-if="isCreatingPost"
          @newMessage="handleCreateNewMessage"
          @cancel="isCreatingPost.value = false"
        />

        <PostEditing v-if="isEditingPost" :post="postToEdit" @edit="handlePostEdit" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.posts-list-container {
  flex-grow: 1;
  flex-shrink: 1;
  transition:
    flex-basis 0.5s ease-in-out,
    max-width 0.5s ease-in-out;
  max-width: 100%;
}
.posts-list--shrunk {
  max-width: 50%;
}
.tile.is-ancestor {
  display: flex;
  gap: 2rem;
  align-items: stretch;
}
</style>

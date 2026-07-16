<script setup>
import { ref, onMounted } from 'vue'

import PostsTable from './components/PostsTable.vue'
import Sidebar from './components/Sidebar.vue'
import PostForm from './components/PostForm.vue'
import PostPreview from './components/PostPreview.vue'
import EditPostForm from './components/EditPostForm.vue'

const posts = ref([])
const loading = ref(false)
const error = ref(false)

const sidebarOpen = ref(false)
const selectedPost = ref(null)
const editing = ref(false)

async function loadPosts() {
  try {
    loading.value = true
    error.value = false

    const response = await fetch(
      'https://mate.academy/students-api/posts?userId=1'
    )

    if (!response.ok) {
      throw new Error()
    }

    posts.value = await response.json()
  } catch (err) {
    error.value = true
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadPosts)

function openSidebar() {
  selectedPost.value = null
  editing.value = false
  sidebarOpen.value = true
}

function selectPost(post) {
  selectedPost.value = post
  editing.value = false
  sidebarOpen.value = true
}

function editPost() {
  editing.value = true
}

async function createPost(post) {
  const response = await fetch(
    'https://mate.academy/students-api/posts',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...post,
        userId: 1,
      }),
    },
  )

  const newPost = await response.json()

  posts.value.unshift(newPost)

  selectedPost.value = newPost
  editing.value = false
}

async function saveEdit(data) {
  const response = await fetch(
    `https://mate.academy/students-api/posts/${selectedPost.value.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )

  const updatedPost = await response.json()

  const index = posts.value.findIndex(
    post => post.id === updatedPost.id,
  )

  posts.value[index] = updatedPost

  selectedPost.value = updatedPost
  editing.value = false
}

async function deletePost() {
  if (!selectedPost.value) {
    return
  }

  await fetch(
    `https://mate.academy/students-api/posts/${selectedPost.value.id}`,
    {
      method: 'DELETE',
    },
  )

  posts.value = posts.value.filter(
    post => post.id !== selectedPost.value.id,
  )

  selectedPost.value = null
  sidebarOpen.value = false
}
</script>

<template>
  <section class="section">
    <div class="container">

      <h1 class="title">
        Vue Dynamic List of Posts
      </h1>

      <button
        class="button is-primary mb-5"
        @click="openSidebar"
      >
        Create new post
      </button>

      <div
        v-if="loading"
        class="notification"
      >
        Loading...
      </div>

      <div
        v-else-if="error"
        class="notification is-danger"
      >
        Failed to load posts
      </div>

      <PostsTable
        v-else
        :posts="posts"
        @select="selectPost"
      />

      <Sidebar
        v-if="sidebarOpen"
        class="Sidebar--open"
      >

        <PostForm
          v-if="!selectedPost"
          @create="createPost"
        />

        <EditPostForm
          v-if="editing && selectedPost"
          :post="selectedPost"
          @save="saveEdit"
        />

        <PostPreview
          v-else-if="selectedPost"
          :post="selectedPost"
          @delete="deletePost"
          @edit="editPost"
        />

      </Sidebar>

    </div>
  </section>
</template>
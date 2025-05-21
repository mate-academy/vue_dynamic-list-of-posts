<script setup>
import { onMounted, ref, reactive } from 'vue'
import { getPosts, createPost, deletePost, updatePost } from '@/api/posts'
import { SidebarMode } from '@/utils/SidebarModes'
import AppHeader from './AppHeader.vue'
import PostsList from './PostsList.vue'
import Sidebar from './Sidebar.vue'
import PostPreview from './PostPreview.vue'
import PostForm from './PostForm.vue'

const user = defineModel('user', {
  type: Object,
})

const currentPost = reactive({
  id: null,
  title: '',
  body: '',
})

const sidebarMode = ref(SidebarMode.Closed)
const posts = ref([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    posts.value = await getPosts()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

const handleViewPost = ({ id, title, body }) => {
  if (currentPost.id === id) {
    currentPost.id = null
    currentPost.title = ''
    currentPost.body = ''
    sidebarMode.value = SidebarMode.Closed
  } else {
    currentPost.id = id
    currentPost.title = title
    currentPost.body = body
    sidebarMode.value = SidebarMode.View_Post
  }
}

const openCreatePostForm = () => {
  currentPost.id = null
  currentPost.title = ''
  currentPost.body = ''
  sidebarMode.value = SidebarMode.Create_Post
}

const openEditPostForm = () => {
  sidebarMode.value = SidebarMode.Edit_Post
}

const cancelForm = () => {
  if (currentPost.id) {
    sidebarMode.value = SidebarMode.View_Post
  } else {
    sidebarMode.value = SidebarMode.Closed
    currentPost.title = ''
    currentPost.body = ''
  }
}

const handleCreatePost = async (title, body) => {
  isLoading.value = true
  try {
    const newPost = await createPost(title, body)
    posts.value.push(newPost)

    currentPost.id = newPost.id
    currentPost.title = newPost.title
    currentPost.body = newPost.body
    cancelForm()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const handleUpdatePost = async (title, body) => {
  isLoading.value = true
  try {
    const updatedPost = await updatePost(currentPost.id, title, body)
    posts.value = posts.value.map((post) => {
      if (post.id === updatedPost.id) {
        return { ...post, title: updatedPost.title, body: updatedPost.body }
      }
      return post
    })
    currentPost.title = updatedPost.title
    currentPost.body = updatedPost.body
    cancelForm()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleDeletePost = async (id) => {
  try {
    await deletePost(id)
    posts.value = posts.value.filter((post) => post.id !== id)
    currentPost.id = null
    cancelForm()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <AppHeader v-model:user="user"></AppHeader>

  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <PostsList
          :posts="posts"
          :isFormOpen="sidebarMode === SidebarMode.Create_Post"
          :current-post-id="currentPost.id"
          v-model:isLoading="isLoading"
          @viewPost="handleViewPost"
          @createPost="openCreatePostForm"
        />

        <Sidebar :isOpen="sidebarMode !== SidebarMode.Closed">
          <PostPreview
            v-if="sidebarMode === SidebarMode.View_Post"
            v-model:currentPost="currentPost"
            @edit="openEditPostForm"
            @delete="handleDeletePost"
          />

          <PostForm
            v-if="sidebarMode === SidebarMode.Create_Post"
            mode="create"
            v-model:currentPost="currentPost"
            @submit="handleCreatePost"
            @cancel="cancelForm"
          />

          <PostForm
            v-if="sidebarMode === SidebarMode.Edit_Post"
            mode="edit"
            v-model:currentPost="currentPost"
            @submit="handleUpdatePost"
            @cancel="cancelForm"
          />
        </Sidebar>
      </div>
    </div>
  </main>
</template>

<style>
h2 {
  font-weight: 600 !important;
}

.tile.is-ancestor:last-child {
  margin-bottom: -0.75rem;
}

.tile.is-parent {
  padding: 0.75rem;
}

.tile {
  align-items: stretch;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: -webkit-min-content;
  min-height: -moz-min-content;
  min-height: min-content;
}

@media screen and (min-width: 769px), print {
  .tile:not(.is-child) {
    display: flex;
  }
}
</style>

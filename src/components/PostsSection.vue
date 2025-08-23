<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="openAddPost">Add New Post</button>
        </div>

        <LoaderSpinner v-if="isLoading" />
        <article v-else-if="hasError" class="message is-danger">
          <div class="message-body">Failed to load posts. Try again later.</div>
        </article>
        <article v-else-if="posts.length === 0" class="message is-warning">
          <div class="message-body">No posts yet</div>
        </article>
        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  @click="isPostOpen(post.id) ? closeSidebar() : openPost(post)"
                >
                  {{ isPostOpen(post.id) ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <PostSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false">
          <template v-if="sidebarContent === 'addPost'">
            <PostForm :userId="userId" @close="isSidebarOpen = false" @postAdded="onPostAdded" />
          </template>
          <template v-else-if="sidebarContent === 'post'">
            <PostPreview
              v-if="selectedPost && !isEditing"
              :post="selectedPost"
              @edit="isEditing = true"
              @delete="deletePost(selectedPost.id)"
            />
            <PostForm
              v-else-if="selectedPost && isEditing"
              :userId="userId"
              :post="selectedPost"
              @postUpdated="onPostUpdated"
              @close="isEditing = false"
            />
          </template>
        </PostSidebar>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getPostsByUserId, deletePost as removePost } from '../server'
import LoaderSpinner from './LoaderSpinner.vue'
import PostSidebar from './PostSidebar.vue'
import PostForm from './PostForm.vue'
import PostPreview from './PostPreview.vue'

export default {
  name: 'PostsSection',
  components: { LoaderSpinner, PostSidebar, PostForm, PostPreview },
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const posts = ref([])
    const isLoading = ref(true)
    const hasError = ref(false)
    const isSidebarOpen = ref(false)
    const sidebarContent = ref(null)
    const selectedPost = ref(null)
    const isEditing = ref(false)

    const openAddPost = () => {
      sidebarContent.value = 'addPost'
      isSidebarOpen.value = true
    }

    const openPost = (post) => {
      selectedPost.value = post
      isEditing.value = false
      sidebarContent.value = 'post'
      isSidebarOpen.value = true
    }

const onPostAdded = (newPost) => {
  posts.value.unshift(newPost)
  selectedPost.value = newPost
  isEditing.value = false
  sidebarContent.value = 'post'
  isSidebarOpen.value = true
}


    const onPostUpdated = (updatedPost) => {
      const index = posts.value.findIndex((p) => p.id === updatedPost.id)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      isEditing.value = false
    }

    onMounted(async () => {
      isLoading.value = true
      hasError.value = false

      try {
        posts.value = await getPostsByUserId(props.userId)
      } catch (e) {
        console.error(e)
        hasError.value = true
      } finally {
        isLoading.value = false
      }
    })

    const isPostOpen = (postId) => {
      return selectedPost.value?.id === postId && isSidebarOpen.value
    }

    const closeSidebar = () => {
      isSidebarOpen.value = false
      selectedPost.value = null
      isEditing.value = false
    }

    const deletePost = async (postId) => {
      try {
        await removePost(postId)
        posts.value = posts.value.filter((post) => post.id !== postId)
        closeSidebar()
      } catch (e) {
        console.error('Failed to delete post:', e)
        alert('Failed to delete the post. Please try again.')
      }
    }

    return {
      deletePost,
      closeSidebar,
      isPostOpen,
      posts,
      isLoading,
      hasError,
      isSidebarOpen,
      sidebarContent,
      openAddPost,
      openPost,
      onPostAdded,
      onPostUpdated,
      selectedPost,
      isEditing,
    }
  },
}
</script>

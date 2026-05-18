<script setup>
import { computed, onMounted, ref } from 'vue'

import {
  createPost,
  deleteComment,
  deletePost,
  getCommentsByPostId,
  getPostsByUserId,
  updatePost,
} from '@/api/posts'
import AddPost from './AddPost.vue'
import EditPost from './EditPost.vue'
import PostLoader from './PostLoader.vue'
import PostPreview from './PostPreview.vue'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const posts = ref([])
const error = ref('')
const isLoading = ref(false)
const selectedPost = ref(null)
const comments = ref([])
const commentsError = ref('')
const areCommentsLoading = ref(false)
const isCommentFormOpen = ref(false)
const failedDeleteCommentId = ref(null)
const sidebarMode = ref('')
const isCreatingPost = ref(false)
const createPostError = ref('')
const createPostFormKey = ref(0)
const isUpdatingPost = ref(false)
const updatePostError = ref('')
const isDeletingPost = ref(false)
const deletePostError = ref('')

const isSidebarOpen = computed(() => Boolean(sidebarMode.value))

const loadPosts = async () => {
  error.value = ''
  isLoading.value = true

  try {
    posts.value = await getPostsByUserId(props.userId)
  } catch {
    error.value = 'Failed to load posts'
  } finally {
    isLoading.value = false
  }
}

const resetCreatePostState = () => {
  createPostError.value = ''
}

const resetEditPostState = () => {
  updatePostError.value = ''
}

const resetDeletePostState = () => {
  deletePostError.value = ''
}

const openCreatePostForm = () => {
  selectedPost.value = null
  comments.value = []
  commentsError.value = ''
  failedDeleteCommentId.value = null
  areCommentsLoading.value = false
  isCommentFormOpen.value = false
  sidebarMode.value = 'create'
  createPostFormKey.value += 1
  resetCreatePostState()
  resetEditPostState()
  resetDeletePostState()
}

const closeSidebar = () => {
  selectedPost.value = null
  comments.value = []
  commentsError.value = ''
  failedDeleteCommentId.value = null
  areCommentsLoading.value = false
  isCommentFormOpen.value = false
  sidebarMode.value = ''
  resetCreatePostState()
  resetEditPostState()
  resetDeletePostState()
}

const loadComments = async (postId) => {
  comments.value = []
  commentsError.value = ''
  failedDeleteCommentId.value = null
  areCommentsLoading.value = true

  try {
    comments.value = await getCommentsByPostId(postId)
  } catch {
    commentsError.value = 'Failed to load comments'
  } finally {
    areCommentsLoading.value = false
  }
}

const openPost = async (post, shouldLoadComments = true) => {
  const isDifferentPost = selectedPost.value?.id !== post.id

  selectedPost.value = post
  comments.value = []
  commentsError.value = ''
  failedDeleteCommentId.value = null
  sidebarMode.value = 'preview'
  resetCreatePostState()
  resetEditPostState()
  resetDeletePostState()

  if (isDifferentPost) {
    isCommentFormOpen.value = false
  }

  if (shouldLoadComments) {
    await loadComments(post.id)
  }
}

const clearCreatePostError = () => {
  createPostError.value = ''
}

const clearUpdatePostError = () => {
  updatePostError.value = ''
}

const handleDeleteComment = async (commentId) => {
  commentsError.value = ''
  failedDeleteCommentId.value = null

  try {
    await deleteComment(commentId)

    comments.value = comments.value.filter((comment) => comment.id !== commentId)
  } catch {
    commentsError.value = 'Failed to delete comment'
    failedDeleteCommentId.value = commentId
  }
}

const retryDeleteComment = () => {
  if (failedDeleteCommentId.value !== null) {
    handleDeleteComment(failedDeleteCommentId.value)
  }
}

const handleCreateComment = (comment) => {
  comments.value = [...comments.value, comment]
  isCommentFormOpen.value = false
}

const handleCreatePost = async ({ title, body }) => {
  createPostError.value = ''

  isCreatingPost.value = true

  try {
    const createdPost = await createPost({
      userId: props.userId,
      title,
      body,
    })

    posts.value = [...posts.value, createdPost]
    await openPost(createdPost, false)
  } catch {
    createPostError.value = 'Failed to create post'
  } finally {
    isCreatingPost.value = false
  }
}

const openEditPostForm = () => {
  sidebarMode.value = 'edit'
  resetEditPostState()
  resetDeletePostState()
}

const cancelEditPost = () => {
  sidebarMode.value = 'preview'
  resetEditPostState()
}

const handleUpdatePost = async ({ title, body }) => {
  if (!selectedPost.value) {
    return
  }

  updatePostError.value = ''
  isUpdatingPost.value = true

  try {
    const updatedPostResponse = await updatePost({
      id: selectedPost.value.id,
      title,
      body,
    })

    const updatedPost = {
      ...selectedPost.value,
      ...updatedPostResponse,
      title,
      body,
    }

    posts.value = posts.value.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    selectedPost.value = updatedPost
    sidebarMode.value = 'preview'
  } catch {
    updatePostError.value = 'Failed to update post'
  } finally {
    isUpdatingPost.value = false
  }
}

const handleDeletePost = async () => {
  if (!selectedPost.value) {
    return
  }

  const postId = selectedPost.value.id

  deletePostError.value = ''
  isDeletingPost.value = true

  try {
    await deletePost(postId)

    posts.value = posts.value.filter((post) => post.id !== postId)
    closeSidebar()
  } catch {
    deletePostError.value = 'Failed to delete post'
  } finally {
    isDeletingPost.value = false
  }
}

onMounted(loadPosts)
</script>

<template>
  <div class="PostsLayout" :class="{ 'PostsLayout--with-sidebar': isSidebarOpen }">
    <div class="PostsListTile" :class="{ 'PostsListTile--with-sidebar': isSidebarOpen }">
      <div class="box is-success">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>
            <button type="button" class="button is-link" @click="openCreatePostForm">
              Add New Post
            </button>
          </div>

          <PostLoader v-if="isLoading" label="Loading posts" />

          <div v-else-if="error" class="notification is-danger is-light">
            {{ error }}
          </div>

          <div v-else-if="posts.length === 0" class="notification is-warning is-light">
            No posts yet
          </div>

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
                  <button type="button" class="button is-link" @click="openPost(post)">Open</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="Sidebar" :class="{ 'Sidebar--open': isSidebarOpen }">
      <div class="box is-success">
        <AddPost
          v-if="sidebarMode === 'create'"
          :key="createPostFormKey"
          :is-loading="isCreatingPost"
          :error="createPostError"
          @cancel="closeSidebar"
          @clear-error="clearCreatePostError"
          @create="handleCreatePost"
        />

        <EditPost
          v-else-if="sidebarMode === 'edit' && selectedPost"
          :post="selectedPost"
          :is-loading="isUpdatingPost"
          :error="updatePostError"
          @cancel="cancelEditPost"
          @clear-error="clearUpdatePostError"
          @save="handleUpdatePost"
        />

        <PostPreview
          v-else-if="sidebarMode === 'preview' && selectedPost"
          :post="selectedPost"
          :comments="comments"
          :is-loading="areCommentsLoading"
          :error="commentsError"
          :can-retry-error="failedDeleteCommentId !== null"
          :is-comment-form-open="isCommentFormOpen"
          :is-deleting-post="isDeletingPost"
          :delete-post-error="deletePostError"
          @cancel-comment="isCommentFormOpen = false"
          @create-comment="handleCreateComment"
          @delete-comment="handleDeleteComment"
          @delete-post="handleDeletePost"
          @edit-post="openEditPostForm"
          @retry-comment-action="retryDeleteComment"
          @write-comment="isCommentFormOpen = true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.PostsLayout {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.PostsLayout--with-sidebar {
  gap: 1.5rem;
}

.PostsListTile {
  min-width: 0;
}

.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-duration: 0.5s;
  transition-property: flex-basis, max-width, opacity, width;
  transition-timing-function: ease-in-out;
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .PostsLayout {
    align-items: flex-start;
    flex-direction: row;
  }

  .PostsListTile {
    flex: 1 1 100%;
    transition:
      flex-basis 0.5s ease-in-out,
      max-width 0.5s ease-in-out;
  }

  .PostsListTile--with-sidebar {
    flex: 0 1 calc(50% - 0.75rem);
    max-width: calc(50% - 0.75rem);
  }

  .Sidebar {
    flex: 0 0 0;
    max-width: 0;
    width: 0;
  }

  .Sidebar--open {
    flex: 0 1 calc(50% - 0.75rem);
    max-width: calc(50% - 0.75rem);
    width: calc(50% - 0.75rem);
  }
}
</style>

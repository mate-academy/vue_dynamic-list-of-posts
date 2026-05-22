<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
    <div class="tile is-child box is-success">
      <div class="content">

        <!-- New post form -->
        <template v-if="mode === 'new'">
          <PostForm
            :loading="formLoading"
            :submit-error="formError"
            @submit="handleCreatePost"
            @cancel="$emit('close')"
          />
        </template>

        <!-- Post view / edit -->
        <template v-else-if="post">

          <!-- Edit mode -->
          <PostForm
            v-if="mode === 'edit'"
            :post="post"
            :loading="formLoading"
            :submit-error="formError"
            @submit="handleUpdatePost"
            @cancel="mode = 'view'"
          />

          <!-- View mode -->
          <template v-else>
            <PostPreview
              :post="post"
              @edit="mode = 'edit'"
              @delete="handleDeletePost"
            />

            <hr />

            <!-- Comments section -->
            <AppLoader v-if="commentsLoading" />

            <div v-else-if="commentsError" class="notification is-danger is-light">
              <button class="delete" @click="loadComments"></button>
              Comments failed to load. Click to retry.
            </div>

            <template v-else>
              <h4 v-if="!comments.length">No comments yet</h4>

              <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @delete="handleDeleteComment"
              />

              <button
                v-if="!showCommentForm"
                type="button"
                class="button is-link"
                @click="showCommentForm = true"
              >
                Write a comment
              </button>

              <NewCommentForm
                v-else
                ref="commentFormRef"
                :loading="commentSubmitting"
                :submit-error="commentError"
                @submit="handleAddComment"
              />
            </template>
          </template>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppLoader from './AppLoader.vue'
import PostPreview from './PostPreview.vue'
import PostForm from './PostForm.vue'
import CommentItem from './CommentItem.vue'
import NewCommentForm from './NewCommentForm.vue'
import { postsApi, commentsApi } from '../api/index.js'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  mode: { type: String, default: 'view' }, // 'view' | 'edit' | 'new'
  post: { type: Object, default: null },
  userId: { type: Number, required: true },
})
const emit = defineEmits(['close', 'post-created', 'post-updated', 'post-deleted', 'update:mode'])

const mode = ref(props.mode)
watch(() => props.mode, (v) => { mode.value = v })

const formLoading = ref(false)
const formError = ref('')

const comments = ref([])
const commentsLoading = ref(false)
const commentsError = ref(false)
const showCommentForm = ref(false)
const commentSubmitting = ref(false)
const commentError = ref('')
const commentFormRef = ref(null)

watch(() => props.post, async (newPost) => {
  if (!newPost) return
  mode.value = 'view'
  showCommentForm.value = false
  commentError.value = ''
  await loadComments()
})

async function loadComments() {
  if (!props.post) return
  commentsLoading.value = true
  commentsError.value = false
  try {
    comments.value = await commentsApi.getByPost(props.post.id)
  } catch {
    commentsError.value = true
  } finally {
    commentsLoading.value = false
  }
}

async function handleCreatePost(data) {
  formLoading.value = true
  formError.value = ''
  try {
    const created = await postsApi.create({ ...data, userId: props.userId })
    emit('post-created', created)
  } catch {
    formError.value = 'Failed to create post. Please try again.'
  } finally {
    formLoading.value = false
  }
}

async function handleUpdatePost(data) {
  formLoading.value = true
  formError.value = ''
  try {
    const updated = await postsApi.update(props.post.id, data)
    mode.value = 'view'
    emit('post-updated', updated)
  } catch {
    formError.value = 'Failed to update post. Please try again.'
  } finally {
    formLoading.value = false
  }
}

async function handleDeletePost() {
  try {
    await postsApi.remove(props.post.id)
    emit('post-deleted', props.post.id)
  } catch {
    alert('Failed to delete post. Please try again.')
  }
}

async function handleAddComment(data) {
  commentSubmitting.value = true
  commentError.value = ''
  try {
    const created = await commentsApi.create({ ...data, postId: props.post.id })
    comments.value.push(created)
    commentFormRef.value?.resetBody()
  } catch {
    commentError.value = 'Failed to add comment. Please try again.'
  } finally {
    commentSubmitting.value = false
  }
}

function handleDeleteComment(id) {
  comments.value = comments.value.filter(c => c.id !== id)
  commentsApi.remove(id).catch(() => {
    // optionally re-add on error
  })
}
</script>

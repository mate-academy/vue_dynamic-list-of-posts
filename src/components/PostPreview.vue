<script setup>
import { createComment, deleteComment, getPostsCommentsApi } from '@/api/comments'
import Comments from './Comments.vue'
import { ref, watch, computed, nextTick } from 'vue'
import ErrorModal from './ErrorModal.vue'
import LoaderComponent from './LoaderComponent.vue'
import AddNewComment from './AddNewComment.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
    default: () => ({ id: null, title: 'Loading...', body: 'Loading...' }),
  },
})

const emit = defineEmits(['delete', 'edit'])

const comments = ref([])
const isCommenting = ref(false)
const loading = ref(false)
const error = ref(null)
const prevName = ref('')
const prevEmail = ref('')

const postId = computed(() => props.post?.id)

watch(
  postId,
  async (newPostId) => {
    if (newPostId) {
      getAllComments(newPostId)
    } else {
      comments.value = []
      error.value = null
      loading.value = false
    }
  },
  { immediate: true },
)

async function getAllComments(id) {
  loading.value = true
  error.value = null
  try {
    const response = await getPostsCommentsApi(id)

    if (response && Array.isArray(response.data)) {
      comments.value = response.data
    } else {
      comments.value = []
    }

    await nextTick()
  } catch {
    error.value = 'Could not load comments for this post.'
    comments.value = []
  } finally {
    loading.value = false
  }
}

function handleEditPost() {
  if (!props.post || props.post.id === null) return
  emit('edit', props.post.id)
}

function handleDeletePost() {
  if (!props.post || props.post.id === null) return
  emit('delete', props.post.id)
}

function handleShowWriteComment() {
  if (!props.post || props.post.id === null) return
  isCommenting.value = true
}

function handleCreateNewComment(comment) {
  loading.value = true
  createComment(props.post.id, comment.name, comment.email, comment.body)
    .then(() => {
      getAllComments(postId.value)
    })
    .catch((e) => {
      error.value = e
    })
    .finally(() => {
      loading.value = false
      isCommenting.value = false
      prevName.value = comment.name
      prevEmail.value = comment.email
    })
}

function handleCommentCancel(prev) {
  prevName.value = prev.name
  prevEmail.value = prev.email
  isCommenting.value = false
}

function handleCommentDelete(id) {
  comments.value = comments.value.filter((com) => com.id !== id)
  deleteComment(id).catch((e) => console.error(e))
}
</script>

<template>
  <div v-if="error">
    <ErrorModal :message="error" @close="error = ''" />
  </div>

  <div v-else>
    <div v-if="loading">
      <LoaderComponent />
    </div>

    <div v-else>
      <div v-if="props.post && props.post.id !== null">
        <div class="block">
          <div class="is-flex is-justify-content-space-between is-align-items-center pb-4">
            <h2 class="m-0 title is-4" data-cy="PostTitle">
              {{ `#${props.post.id}: ${props.post.title}` }}
            </h2>
            <div class="is-flex pl-3">
              <span
                class="icon is-small is-right is-clickable"
                @click="handleEditPost"
                title="Edit Post"
              >
                <i class="fas fa-pen"></i>
              </span>
              <span
                class="icon is-small is-right has-text-danger is-clickable ml-3"
                @click="handleDeletePost"
                title="Delete Post"
              >
                <i class="fas fa-trash"></i>
              </span>
            </div>
          </div>
          <p data-cy="PostBody">{{ props.post.body }}</p>
        </div>

        <hr />

        <div v-if="!isCommenting" class="block comments-section">
          <div v-if="comments && comments.length > 0">
            <div v-for="comment of comments" :key="comment.id">
              <Comments :comment="comment" @delete="handleCommentDelete(comment.id)" />
            </div>
          </div>

          <div class="block" v-else>
            <p class="title is-4">No comments yet</p>
          </div>
        </div>

        <div v-else>
          <AddNewComment
            :prevName="prevName"
            :prevEmail="prevEmail"
            @newComment="handleCreateNewComment"
            @cancel="handleCommentCancel"
          />
        </div>

        <button
          v-if="!isCommenting"
          type="button"
          class="button is-link mt-4"
          @click="handleShowWriteComment"
          data-cy="WriteCommentButton"
        >
          Write a comment
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure Bulma or your CSS framework styles are correctly applied */
.m-0 {
  margin: 0 !important;
}
.pb-4 {
  padding-bottom: 1.5rem !important; /* Adjust as per Bulma's .pb-4 if needed */
}
.pl-3 {
  padding-left: 0.75rem !important; /* Adjust as per Bulma's .pl-3 */
}
.ml-3 {
  margin-left: 0.75rem !important;
}
.mt-4 {
  margin-top: 1rem !important;
}
.comments-section {
  margin-top: 1.5rem;
}
/* Add any other component-specific styles here */
</style>

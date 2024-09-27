<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPostComments, deleteComment } from '@/api/comments'
import Loader from './Loader.vue'
import Comment from './Comment.vue'
import CommentForm from './CommentForm.vue'

const { postId } = defineProps({
  postId: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  }
})

const comments = ref([])
const state = ref('success')
const isFormVisible = ref(false)

const formName = ref('')
const formEmail = ref('')

const loadComments = () => {
  state.value = 'loading'

  getPostComments(postId)
    .then(({ data }) => {
      comments.value = data
    })
    .then(() => {
      state.value = 'success'
    })
    .catch(() => {
      state.value = 'error'
    })
}

onMounted(() => {
  loadComments()
})

watch(
  () => postId,
  (newId, oldId) => {
    if (newId !== oldId) {
      isFormVisible.value = false
      loadComments()
    }
  }
)

const handleDeleteComment = (id) => {
  deleteComment(id).then(() => {
    comments.value = comments.value.filter((comment) => comment.id !== id)
  })
}

const handleCloseForm = ({ name, email }) => {
  formName.value = name
  formEmail.value = email
  isFormVisible.value = false
}
</script>

<template>
  <Loader v-if="state === 'loading'" />
  <div v-else-if="state === 'error'" class="notification is-danger">
    <p>Failed to load comments.</p>
    <button class="button is-danger is-light" @click="loadComments">Reload</button>
  </div>
  <template v-else-if="state === 'success' && !isFormVisible">
    <Comment
      v-for="comment in comments"
      :key="comment.id"
      :comment
      @deleteComment="handleDeleteComment"
    />
    <div v-if="!comments.length" class="block">
      <p class="title is-4">No comments yet</p>
    </div>
  </template>

  <button v-if="!isFormVisible" @click="isFormVisible = true" type="button" class="button is-link">
    Write a comment
  </button>

  <CommentForm
    v-else
    :postId="postId"
    :formName
    :formEmail
    @closeForm="handleCloseForm"
    @addComment="comments.push($event)"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPostComments, deleteComment } from '@/api/comments'
import Loader from './Loader.vue'
import Comment from './Comment.vue'
import CommentForm from './CommentForm.vue'

const { postId } = defineProps({
  postId: Number
})

const comments = ref([])
const isLoading = ref(false)
const isError = ref(false)
const isFormVisible = ref(false)

const formName = ref('')
const formEmail = ref('')

const loadComments = () => {
  isError.value = false
  isLoading.value = true
  getPostComments(postId)
    .then(({ data }) => {
      comments.value = data
    })
    .catch(() => {
      isError.value = true
    })
    .finally(() => {
      isLoading.value = false
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
  <Loader v-if="isLoading" />
  <div v-else-if="!isLoading && isError" class="notification is-danger">
    <p>Failed to load comments.</p>
    <button class="button is-danger is-light" @click="loadComments">Reload</button>
  </div>
  <template v-else-if="!isLoading && !isError && !isFormVisible">
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

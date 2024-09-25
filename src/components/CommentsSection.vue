<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPostComments } from '@/api/comments'
import Loader from './Loader.vue'

const { postId } = defineProps({
  postId: {
    type: Number
  }
})

const comments = ref([])
const isLoading = ref(false)
const isError = ref(false)

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
      loadComments()
    }
  }
)
</script>

<template>
  <Loader v-if="isLoading" />
  <div v-else-if="!isLoading && isError" class="notification is-danger">
    <p>Failed to load comments.</p>
    <button class="button is-danger is-light" @click="loadComments">Reload</button>
  </div>
  <div v-else-if="!isLoading && !isError && !comments.length" class="block">
    <p class="title is-4">No comments yet</p>
    <button type="button" className="button is-link">Write a comment</button>
  </div>
</template>

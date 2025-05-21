<script setup>
import { onMounted, ref, watch } from 'vue'
import { getComments, addComment, deleteComment } from '@/api/comments'
import Loader from './Loader.vue'
import Comment from './Comment.vue'
import NewCommentForm from './NewCommentForm.vue'

const currentPost = defineModel('currentPost', {
  type: Object,
  default: () => ({ id: null, title: '', body: '' }),
})

const comments = ref([])
const newCommentFormIsShown = ref(false)
const isLoading = ref(false)

const onShowPost = async () => {
  if (!currentPost.value?.id) {
    return
  }

  showCommentForm(false)
  isLoading.value = true

  try {
    comments.value = await getComments(currentPost.value.id)
  } catch (error) {
    console.error(error)
    comments.value = []
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits(['delete', 'edit'])

const showCommentForm = (show) => {
  newCommentFormIsShown.value = show
}

const createComment = async (name, email, body) => {
  try {
    const newComment = await addComment(currentPost.value.id, name, email, body)
    comments.value.push(newComment)
    showCommentForm(false)
  } catch (error) {
    console.log(error)
  }
}

const removeComment = async (id) => {
  const originalComments = [...comments.value]
  comments.value = comments.value.filter((comment) => comment.id !== id)

  try {
    await deleteComment(id)
  } catch (error) {
    console.error(error)
    comments.value = originalComments
  }
}

onMounted(onShowPost)
watch(() => currentPost.value, onShowPost, { deep: true })
</script>

<template>
  <Loader v-if="isLoading" />

  <div class="block" v-if="!isLoading">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ currentPost.id }}: {{ currentPost.title }}</h2>

      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="emit('edit')">
          <i class="fas fa-pen-to-square"></i>
        </span>

        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="emit('delete', currentPost.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>

    <p data-cy="PostBody">{{ currentPost.body }}</p>

    <div class="block" v-if="comments.length === 0">
      <p class="title is-4">No comments yet</p>
    </div>

    <template v-if="comments.length > 0 && !newCommentFormIsShown">
      <Comment
        :key="comment.id"
        v-for="comment in comments"
        :comment="comment"
        @delete="removeComment"
      />
    </template>

    <NewCommentForm
      v-if="newCommentFormIsShown"
      @submit="createComment"
      @cancel="showCommentForm(false)"
    />

    <button
      v-if="!newCommentFormIsShown"
      type="button"
      class="button is-link"
      @click="showCommentForm(true)"
    >
      Write a comment
    </button>
  </div>
</template>

<style></style>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="$emit('edit')">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span class="icon is-small has-text-danger is-clickable ml-3" @click="$emit('delete')">
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>

    <div class="block" v-if="isLoadingComments">
      <LoaderSpinner />
    </div>

    <article v-else-if="commentsError" class="message is-danger">
      <div class="message-body">
        Failed to load comments. Try again later.
        <button class="button is-small is-light ml-3" @click="loadComments">Retry</button>
      </div>
    </article>

    <div class="block" v-else-if="comments.length > 0">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="message is-small"
      >
        <div class="message-header is-flex is-justify-content-space-between">
          <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
          <button
            type="button"
            class="delete is-small"
            aria-label="delete"
            @click="removeComment(comment.id)"
          ></button>
        </div>
        <div class="message-body">{{ comment.body }}</div>
      </article>
    </div>

    <div class="block" v-else>
      <p class="title is-4">No comments yet</p>
    </div>

    <div class="block">
      <div v-if="isCommenting">
        <CommentForm
          :postId="post.id"
          :initialData="lastCommentData"
          @submit="handleCommentSubmit"
          @cancel="isCommenting = false"
        />
      </div>
      <button v-else type="button" class="button is-link" @click="isCommenting = true">
        Write a comment
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CommentForm from './CommentForm.vue'
import LoaderSpinner from './LoaderSpinner.vue'
import { getComments, deleteComment } from '../server'

const props = defineProps({
  post: Object,
})

const comments = ref([])
const isCommenting = ref(false)
const isLoadingComments = ref(false)
const commentsError = ref(false)
const lastCommentData = ref(null)

const loadComments = async () => {
  if (!props.post) return
  isLoadingComments.value = true
  commentsError.value = false
  comments.value = []
  isCommenting.value = false
  lastCommentData.value = null

  try {
    comments.value = await getComments(props.post.id)
  } catch (error) {
    console.error('Failed to load comments:', error)
    commentsError.value = true
  } finally {
    isLoadingComments.value = false
  }
}

watch(
  () => props.post,
  () => loadComments(),
  { immediate: true }
)

const handleCommentSubmit = (newComment) => {
  comments.value.push(newComment)
  lastCommentData.value = {
    name: newComment.name,
    email: newComment.email,
    comment: newComment.body,
  }
  isCommenting.value = false
}

const removeComment = async (commentId) => {
  const removedComment = comments.value.find(c => c.id === commentId)
  comments.value = comments.value.filter(c => c.id !== commentId)

  try {
    await deleteComment(commentId)
  } catch (error) {
    console.error('Failed to delete comment:', error)

    comments.value.push(removedComment)

    if (confirm('Failed to delete comment. Retry?')) {
      removeComment(commentId)
    }
  }
}

</script>


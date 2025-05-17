<script setup>
import { removeComments } from '@/api/comments'

const comments = defineModel('comments', {
  type: Array,
})
const { comment } = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})
const onDelete = async () => {
  try {
    await removeComments(comment.id)
    comments.value = comments.value.filter((c) => c.id !== comment.id)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button type="button" class="delete is-small" aria-label="delete" @click="onDelete"></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { removeComments } from '@/api/api.comments'

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
  <article className="message is-small">
    <div className="message-header">
      <a href="{`mailto:${comment.email}`}"> {{ comment.name }} </a>
      <button
        type="button"
        className="delete is-small"
        aria-label="delete"
        @click="onDelete"
      ></button>
    </div>
    <div className="message-body">{{ comment.body }}</div>
  </article>
</template>

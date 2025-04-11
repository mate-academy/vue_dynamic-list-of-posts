<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button type="button" class="delete is-small" aria-label="delete" @click="deleteComment(comment.id)">delete button</button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
<script lang="ts">
import type { Comment } from '@/types/comment'
import type { PropType } from 'vue'

export default {
  name: 'PostComment',
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true,
    },
    deleteComment: {
      type: Function,
      required: true,
    },
  },
}
</script>

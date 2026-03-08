<script lang="ts">
import { defineComponent } from 'vue'
import type { Comment } from '../../api/posts'

export default defineComponent({
  props: {
    comment: {
      type: Object as () => Comment,
      required: true,
    },
  },

  emits: ['delete'],
})
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="$emit('delete', comment.id)"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

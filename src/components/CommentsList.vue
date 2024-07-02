<script lang="ts">
import type { CustomComment } from '@/types/CustomComment'
import type { Comment } from '../types/Comment'
import type { PropType } from 'vue'

export default {
  props: {
    commentsList: [] as PropType<Comment[] | CustomComment[]>
  },
  emits: ['fetchDeleteComment']
}
</script>

<template>
  <article
    class="message is-small"
    data-cy="Comment"
    v-for="comment in commentsList"
    :key="comment.id"
  >
    <div class="message-header">
      <a :href="`mailto:${comment.email}`" data-cy="CommentAuthor">
        {{ comment.name }}
      </a>

      <button
        data-cy="CommentDelete"
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="$emit('fetchDeleteComment', comment.id)"
      />
    </div>

    <div class="message-body" data-cy="CommentBody">{{ comment.body }}</div>
  </article>
</template>

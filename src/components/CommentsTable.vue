<script lang="ts">
import type { Comment } from '@/types/Comments.type';

export default {
  props: {
    comments: {
      type: Array as () => Comment[],
      required: true
    }
  },

  methods: {
    handleDelete(commentId: number) {
      this.$emit('deleted', commentId);
    }
  }
}
</script>

<template>
  <article v-for="comment in comments" :key="comment.id" class="message comment">
    <div class="message-header custom-header">
      <a :href="`mailto:${comment.email}`" class="message-header-name">
        {{ comment.name }}
      </a>

      <button class="delete is-small custom-delete" aria-label="delete" @click="handleDelete(comment.id)">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="message-body custom-body">
      {{ comment.body }}
    </div>
  </article>
</template>

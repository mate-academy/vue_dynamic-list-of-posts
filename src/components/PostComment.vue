<script lang="ts">
import type { Comment } from '@/types/types';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true,
    }
  },
  emits: ['delete'],
});
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>

      <button
        @click="$emit('delete', comment.id)"
        type="button"
        class="delete is-small"
        aria-label="delete"
      >
        delete button
      </button>
    </div>

    <div class="message-body">{{comment.body}}</div>
  </article>
</template>

<script setup lang="ts">
import { Comment } from '../types/Comment';

defineProps<Comment>();

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>();
</script>

<template>
  <article class="message is-small" data-cy="Comment">
    <div class="message-header">
      <a :href="`mailto:${email}`" data-cy="CommentAuthor">{{ name }}</a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        data-cy="CommentDelete"
        @click="emit('delete', id)"
      ></button>
    </div>
    <div class="message-body" data-cy="CommentBody">
      {{ body }}
    </div>
  </article>
</template>
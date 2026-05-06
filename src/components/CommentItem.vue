<script setup lang="ts">
import type { PostComment } from "../types/Comment";

defineProps<{
  comment: PostComment;
  isDeleting: boolean;
}>();

const emit = defineEmits<{
  (e: "delete", id: number): void;
}>();
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>

      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        :disabled="isDeleting"
        @click="emit('delete', comment.id)"
      />
    </div>

    <div class="message-body">
      {{ comment.body }}
    </div>
  </article>
</template>

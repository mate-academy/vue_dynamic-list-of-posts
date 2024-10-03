<script setup lang="ts">
import { Comment } from "../../../../types/comment";

defineProps<{
  comment: Comment;
  deletePostComment: (commentId: number) => Promise<void>;
}>();
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button @click="deletePostComment(comment.id!)" type="button" class="delete is-small" aria-label="delete">
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

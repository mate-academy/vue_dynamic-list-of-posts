<script setup>
  import { deleteComment } from '@/api/comments';

  const { comment } = defineProps({
    comment: {
      type: Object,
      required: true,
    },
  });

  const comments = defineModel('comments', { type: Array });

  const onDelete = async () => {
    try {
      await deleteComment(comment.id);

      const index = comments.value.findIndex(item => item.id === comment.id);

      if (index !== -1) {
        comments.value.splice(index, 1);
      }
    } catch (error) {
      console.error(error);
    }
  };
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>

      <button type="button" class="delete is-small" aria-label="delete" @click="onDelete"></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import * as commentsApi from '@/api/comments';

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  onDelete: {
    type: Function,
  },
});

const errorMessage = ref('');

const deleteComment = async () => {
  try {
    await commentsApi.deleteComment(props.comment.id);

    props.onDelete(props.comment.id);
  } catch (err) {
    errorMessage.value = 'Failed to delete comment';
  }
};
</script>

<template>
  <article class="message is-small mt-4">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }} </a>
      <button
        type="button"
        @click="deleteComment"
        class="delete is-small"
        aria-label="delete"
      >
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

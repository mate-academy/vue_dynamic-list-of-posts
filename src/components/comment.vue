<script setup>
import { deleteComment } from '@/api/comments';
import { useCommentsStore } from '@/stores/commentsStore';

const commentsStore = useCommentsStore();

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
   postId: Number,
});

const handleDelete = async () => {
  try {
    await deleteComment(props.comment.id);
    commentsStore.removeComment(props.comment.id, props.comment.postId);
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
      <button
        @click="handleDelete"
        type="button"
        class="delete is-small"
        aria-label="delete"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

<script setup>
const emit = defineEmits(['deleteComment']);

defineProps({
  comments: Array,
});

const handleDeleteComment = (commentId) => {
  emit('deleteComment', commentId);
};
</script>

<template>
  <article v-for="comment in comments" :key="comment.id" class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }} </a>

      <button type="button" class="delete is-small" aria-label="delete" @click="handleDeleteComment(comment.id)">
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
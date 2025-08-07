<script setup>
defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['deleteComment']);
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>

      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="emit('deleteComment', comment.id)"
      />
    </div>

    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

<style></style>

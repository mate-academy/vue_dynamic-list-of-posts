<script setup>
defineProps({
  comment: {
    type: Object,
    required: true,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['delete']);
</script>

<template>
  <article class="message is-small" data-cy="Comment">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`" data-cy="CommentAuthor">{{ comment.name }}</a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete comment"
        :disabled="deleting"
        @click="$emit('delete', comment)"
      ></button>
    </div>
    <div class="message-body preserve-lines" data-cy="CommentBody">
      {{ comment.body }}
    </div>
  </article>
</template>

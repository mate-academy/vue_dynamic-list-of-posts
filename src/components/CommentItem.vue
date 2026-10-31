<script setup>
defineProps({
  comment: { type: Object, required: true },
  failed: Boolean,
});

defineEmits(['delete']);
</script>

<template>
  <article class="message is-small" data-cy="Comment">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="$emit('delete')"
      >
        delete button
      </button>
    </div>
    <div class="message-body">
      <span style="white-space: pre-line">{{ comment.body }}</span>
      <p v-if="failed" class="help is-danger mt-2">
        Could not delete this comment. Click the delete button to try again.
      </p>
    </div>
  </article>
</template>

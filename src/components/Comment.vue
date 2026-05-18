<script setup>
defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete'])
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">
        {{ comment.name }}
      </a>

      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="$emit('delete', comment.id)"
      ></button>
    </div>

    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

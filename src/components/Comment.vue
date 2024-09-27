<script setup>
const { comment } = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['deleteComment'])
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="emits('deleteComment', comment.id)"
      >
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

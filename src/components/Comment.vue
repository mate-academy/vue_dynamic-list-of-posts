<script setup>

const { comment } = defineProps({
  comment: {},
});

const emit = defineEmits(['delete']);
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>

      <button type="button" class="delete is-small" aria-label="delete" @click="$emit('delete', comment)"></button>
    </div>
    <div class="message-body">
      {{ comment.body }}
    </div>
  </article>
</template>

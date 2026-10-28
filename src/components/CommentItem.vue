<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});

defineEmits(['delete-comment']);
</script>

<template>
<article class="message is-small">
  <div class="message-header">
    <a :href="`mailto:${email}`"> {{ name }} </a>
    <button 
        type="button" 
        class="delete is-small" 
        aria-label="delete" 
        @click="$emit('delete-comment', id)"
    >
    </button>
  </div>
  <div class="message-body">{{ body }}</div>
</article>
</template>

<style scoped></style>
<script setup>
  const props = defineProps({
    comment: Object,
  });

  const emit = defineEmits(['deleteComment']);

  function handleDelete() {
    emit('deleteComment', props.comment.id);
  }
</script>

<template>
  <article class="message is-small">
  <div class="message-header">
    <a :href="`mailto:${comment.email}`"> {{ comment.name}} </a>
    <button 
      type="button" 
      class="delete is-small" 
      aria-label="delete"
      @click="handleDelete"
    >
    </button>
  </div>
  <div class="message-body">{{ comment.body }}</div>
</article>
</template>
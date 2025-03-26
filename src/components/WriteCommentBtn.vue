<script setup>
defineProps({
  startCreatingComment: Function,
  isCommentCreating: Boolean,
});

const emit = defineEmits(["startCreating"]);
</script>

<template>
  <button
    @click="emit('startCreating', isCommentCreating)"
    type="button"
    class="button is-link"
  >
    Write a comment
  </button>
</template>

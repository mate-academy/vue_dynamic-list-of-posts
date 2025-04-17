<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\WriteCommentButton.vue -->
<template>
  <button type="button" class="button is-link" @click="$emit('write-comment')">
    Write a comment
  </button>
</template>

<script>
export default {
  name: 'WriteCommentButton',
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
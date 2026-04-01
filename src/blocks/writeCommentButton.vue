<script setup lang="ts">
defineProps({})
defineEmits(['open'])
</script>

<template>
  <button
    type="button"
    class="button is-link"
    data-cy="WriteCommentButton"
    @click="$emit('open')"
  >
    Write a comment
  </button>
</template>
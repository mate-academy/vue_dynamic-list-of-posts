<script setup>
const emit = defineEmits(["click"]);
</script>

<template>
  <button
    data-cy="WriteCommentButton"
    type="button"
    class="button is-link"
    @click="emit('click')"
  >
    Write a comment
  </button>
</template>

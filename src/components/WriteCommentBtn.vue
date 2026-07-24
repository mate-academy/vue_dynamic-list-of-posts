<script setup>
const emit = defineEmits(["setWriteComment"]);
</script>

<template>
  <button
    type="button"
    class="button is-link"
    @click="emit('setWriteComment', true)"
  >
    Write a comment
  </button>
</template>

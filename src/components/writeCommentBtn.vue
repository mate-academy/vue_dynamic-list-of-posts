<script setup>
const emit = defineEmits(['write-comment']);
</script>

<template>
    <button type="button" class="button is-link" @click="emit('write-comment')">Write a comment</button>
</template>

<style scoped></style>
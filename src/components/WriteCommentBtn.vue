<script setup>

const emit = defineEmits(['click'])
</script>

<template>
    <button type="button" class="button is-link" @click="$emit('click')">Write a comment</button>
</template>
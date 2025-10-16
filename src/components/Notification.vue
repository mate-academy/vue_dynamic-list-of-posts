<template>
  <div v-if="message" :class="['notification', typeClass]">
    <button class="delete" @click="$emit('close')"></button>
    <slot>{{ message }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'is-danger' },
});

const typeClass = computed(() => props.type);
</script>

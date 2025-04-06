<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
});
</script>

<template>
  <button @click="$emit('update:modelValue', true)" type="button" class="button is-link">Write a comment</button>
</template>

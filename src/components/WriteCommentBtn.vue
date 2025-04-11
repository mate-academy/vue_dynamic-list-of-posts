<template>
  <button type="button" @click="togleCommentButton" className="button is-link">Write a comment</button>
</template>
<script lang="ts">
export default {
  name: 'WriteCommentBtn',
  props: {
    modelValue: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    togleCommentButton() {
      this.$emit('update:modelValue', true)
    },
  },
}
</script>

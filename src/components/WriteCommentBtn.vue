<script>
export default {
  name: 'WriteCommentBtn',
  emits: ['click'],
};
</script>

<template>
  <button
    type="button"
    class="button is-link"
    aria-label="Write a comment"
    @click="$emit('click')"
  >
    <slot>Write a comment</slot>
  </button>
</template>

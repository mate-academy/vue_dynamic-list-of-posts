<script>
  export default {
    name: 'MessageComponent',
    emits: ['hide'],
    props: {
      active: Boolean,
    },
    methods: {
      hideMessage() {
        this.$emit('hide');
      },
    }
  }
</script>

<template>
  <article
    class="message is-danger is-small"
    :class="{ 'message--hidden': !active }"
  >
    <div class="message-header">
      <p>Error</p>
      <button class="delete" @click="hideMessage"></button>
    </div>

    <div class="message-body">
      <slot>Something wrong</slot>
    </div>
  </article>
</template>

<style>
</style>
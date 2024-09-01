<script>
export default {
    emits: ['hide'],
    methods: {
        hide() {
            this.$emit('hide');
        }
    }
}
</script>

<template>
    <article
    class="message is-danger"
  >
    <div class="message-header">
        <slot name="header"></slot>
        <button class="delete" @click="hide"></button>
    </div>

    <div class="message-body">
      <slot></slot>
    </div>
  </article>
</template>

<style>
    .message {
        margin-top: 30px;
    }
</style>
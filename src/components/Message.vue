<script>
export default {
  emits: ['hide'],
  props: {
    text: String,
    active: Boolean,
  },
  methods: {
    hide() {
      this.$emit('hide')
    },
  },
}
</script>

<template>
  <article
    data-cy="ErrorNotification"
    class="message"
    :class="{ 'message--hidden': !active }"
  >
    <div class="message-header">
      <p>Error</p>
      <button
        data-cy="HideErrorButton"
        type="button"
        class="delete"
        @click="hide"
      ></button>
    </div>
    <div class="message-body">
      {{ text }}
    </div>
  </article>
</template>

<style>
.message--hidden {
  display: none;
}
</style>

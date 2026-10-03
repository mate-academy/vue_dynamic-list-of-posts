<script>
export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  emits: ['close'],
};
</script>

<template>
  <div class="notification is-danger is-light">
    <button type="button" class="delete" aria-label="Close" @click="$emit('close')"></button>
    {{ message }}
  </div>
</template>

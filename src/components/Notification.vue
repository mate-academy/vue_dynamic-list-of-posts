<script>
export default {
  name: "Notification",
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="notification is-danger is-light">
    <button class="delete" @click="$emit('close')"></button>

    {{ errorMessage }}
  </div>
</template>

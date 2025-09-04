<template>
  <div :class="['notification', type]">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    type: {
      type: String,
      default: 'is-info',
    },
  },
};
</script>

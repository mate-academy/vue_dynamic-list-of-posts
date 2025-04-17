<template>
  <div class="app-loader" role="status" aria-label="Loading">
    <div
      class="spinner"
      :style="{ width: size + 'px', height: size + 'px', borderWidth: size / 10 + 'px' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AppLoader',
  props: {
    size: {
      type: Number,
      default: 40,
    },
  },
};
</script>

<style scoped>
.app-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
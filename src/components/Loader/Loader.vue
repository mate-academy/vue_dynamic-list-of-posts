<template>
  <div class="Loader" data-cy="Loader">
    <div class="Loader__content"></div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style scoped>
.Loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.Loader__content {
  width: 2rem;
  height: 2rem;
  border: 3px solid #3273dc;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

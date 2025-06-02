<template>
  <div class="is-flex is-justify-content-center is-align-items-center mt-2">
    <span class="loader"></span>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

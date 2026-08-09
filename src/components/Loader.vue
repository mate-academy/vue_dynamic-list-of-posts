<template>
  <div class="is-flex is-justify-content-center p-5">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #dbdbdb;
  border-top-color: #485fc7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div class="loader-wrapper">
    <span class="loader is-loading"></span>
  </div>
</template>

<script>
export default {
  name: "Loader",
};
</script>

<style>
.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}
.loader.is-loading {
  border: 4px solid #dbdbdb;
  border-top: 4px solid #3273dc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

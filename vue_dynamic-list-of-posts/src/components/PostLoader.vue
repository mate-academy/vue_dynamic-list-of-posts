<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\PostLoader.vue -->
<template>
  <div class="is-flex is-justify-content-center is-align-items-center mt-2">
    <AppLoader />
  </div>
</template>

<script>
import AppLoader from './loader/AppLoader.vue';

export default {
  name: 'PostLoader',
  components: {
    AppLoader,
  },
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
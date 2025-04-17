<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\AppHeader.vue -->
<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h1 class="title is-size-4">Vue List Of Posts</h1>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ user.name }}</p>
          </div>
          <a class="button is-light" @click="$emit('logout')">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.navbar {
  position: fixed; /* Fix the navbar to the top of the viewport */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure the navbar is below the sidebar */
  background: #fff; /* Background color for the navbar */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Add a shadow for better visibility */
}
</style>
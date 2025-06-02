<template>
  <nav class="navbar is-light" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h2 class="navbar-item is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end ml-auto">
      <div class="navbar-item">
        <span class="mr-4">User: {{ user?.name || 'Guest' }}</span>
        <button class="button is-danger is-light" @click="$emit('logout')">
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>

<style scoped>
.navbar {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  flex-grow: 1;
}

.navbar-end {
  display: flex;
  align-items: center;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1100;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>

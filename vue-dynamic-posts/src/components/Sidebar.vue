<template>
  <aside class="Sidebar">
    <slot />
  </aside>
</template>

<style scoped>
.Sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  padding: 30px;
  box-shadow: -2px 0 10px #ddd;
  transform: translateX(100%);
  transition: 0.3s;

  overflow-y: auto;
  box-sizing: border-box;
}

.Sidebar--open {
  transform: translateX(0);
}
</style>
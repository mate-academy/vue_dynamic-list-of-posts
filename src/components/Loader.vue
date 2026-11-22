<template>
  <div class="loader-container" role="status">
    <span class="loader-spinner"></span>
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.loader-spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e9d5ff;
  border-top-color: #aa3bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
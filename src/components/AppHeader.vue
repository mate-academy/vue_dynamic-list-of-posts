<script setup>
const emit = defineEmits(['logOut'])
defineProps({ userName: String })
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ userName }}</p>
          </div>

          <a class="button is-light" @click="emit('logOut')"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style></style>

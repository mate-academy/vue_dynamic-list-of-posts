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

          <button @click="$emit('logout')" class="button is-light">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  userName: String,
});

defineEmits(["logout"]);
</script>
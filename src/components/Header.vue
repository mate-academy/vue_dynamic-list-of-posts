<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['logout']);
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="title is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ props.user.name }}</p>
          </div>

          <a class="button is-light" @click="emit('logout')">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

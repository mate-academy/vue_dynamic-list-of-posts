<template>
  <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <strong>Vue List Of Posts</strong>
      </a>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <span class="mr-3">User: {{ user.name }}</span>
        <button class="button is-light" @click="$emit('logout')">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({ user: { type: Object, required: true } })
defineEmits(['logout'])
</script>

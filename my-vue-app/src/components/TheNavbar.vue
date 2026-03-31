<script setup>
defineProps({
  userName: {
    type: String,
    required: true,
  }
});

defineEmits(['logout']);
</script>

<template>
  <nav class="navbar is-white has-shadow px-5">
    <div class="navbar-brand">
      <span class="navbar-item is-size-4 has-text-weight-bold has-text-black">
        Vue List Of Posts
      </span>
    </div>
    <div class="navbar-end is-flex is-align-items-center">
      <div class="navbar-item has-text-black">User: {{ userName }}</div>
      <div class="navbar-item">
        <button
          class="button is-light"
          @click="$emit('logout')"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

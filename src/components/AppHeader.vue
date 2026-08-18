<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
});

defineEmits(['logout']);
</script>

<template>
  <nav class="navbar app-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
        <h2 class="is-size-4 has-text-weight-semibold">
          Vue List Of Posts
        </h2>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons is-align-items-center">
          <p class="mr-4" data-cy="CurrentUser">
            User: {{ user.name }}
          </p>
          <button type="button" class="button is-light" data-cy="LogoutButton" @click="$emit('logout')">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

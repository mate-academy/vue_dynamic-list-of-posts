<script setup lang="ts">
defineProps<{
  user: {
    name: string;
  };
}>();
</script>
<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-item">
      <h2 class="is-size-4 has-text-weight-bold">
        Vue List Of Posts
      </h2>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="is-flex is-align-items-center">
          
          <div class="mr-4">
            <p>User: {{ user.name }}</p>
          </div>

          <button type="button" class="button is-light">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
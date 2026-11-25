<script setup lang="ts">
import type { User } from '@/types/User';

interface Props {
  user: User;
}

const props = defineProps<Props>();
const emit = defineEmits<{ logout: [] }>();
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation" data-cy="AppHeader">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ props.user.name }}</p>
          </div>
          <button type="button" class="button is-light" @click="emit('logout')">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
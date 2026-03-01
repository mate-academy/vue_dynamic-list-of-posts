<script setup lang="ts">
type User = {
  name: string;
};

defineProps<{
  user: User | null;
}>();

const emit = defineEmits<{
  (e: "logout"): void;
}>();
</script>

<template>
  <nav
    class="navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-item">
      <h2 class="is-size-4">
        Vue List Of Posts
      </h2>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div
            v-if="user"
            class="mr-5 mb-2"
          >
            <p>User: {{ user.name }}</p>
          </div>

          <button
            type="button"
            class="button is-light"
            @click="emit('logout')"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

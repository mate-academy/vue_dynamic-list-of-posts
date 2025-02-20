<script>
export default {
  name: 'Header',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ['logout'],
};
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <p v-if="user" class="mr-5 mb-2">User: {{ user.name }}</p>
          <a class="button is-light" @click="$emit('logout')">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

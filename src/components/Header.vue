<script>
export default {
  name: 'Header',
  props: {
    name: {
      type: String,
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
        <div class="buttons is-align-items-center">
          <div class="mr-5 mb-2">
            <p>User: {{ name }}</p>
          </div>
          <button type="button" class="button is-light" @click="$emit('logout')">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

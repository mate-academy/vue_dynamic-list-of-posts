<script>
export default {
  name: 'Header',
  props: {
    user: Object,
  },
  emits: ['logout'],
  methods: {
    logout() {
      this.$emit('logout');
    },
  },
};
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h1 class="is-size-4 has-text-weight-semibold">Vue List Of Posts</h1>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5">
            <p>User: {{ user.name }}</p>
          </div>

          <a
            class="button is-light has-text-weight-normal logout-button"
            @click="logout"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.logout-button {
  margin-bottom: 0 !important;
}
</style>

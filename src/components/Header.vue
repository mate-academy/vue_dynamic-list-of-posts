<script>
export default {
  props: {
    user: Object
  },

  emits: ['logout'],

  methods: {
    logout() {
      this.$emit('logout');
    }
  }
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p> {{ user?.name || 'Loading...' }}</p>
          </div>

          <a class="button is-light" @click="logout">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style></style>
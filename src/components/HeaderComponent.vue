<script>
  export default {
    name: 'HeaderComponent',
    props: {
      userName: String,
    },
    methods: {
      handleLogout() {
        localStorage.removeItem('user');
        this.$router.push({ path: "/login" });
      },
    },
  }
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h1 class="is-size-4">Vue List Of Posts</h1>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ userName }}</p>
          </div>

          <a class="button is-light" @click="this.handleLogout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
</style>
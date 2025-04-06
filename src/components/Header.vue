<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-reserved-component-names -->
<script>
export default {
  name: 'Header',
  props: {
    user: Object,
  },
  emits: ['logOut'],
  methods: {
    handleLogOut() {
      this.$emit('logOut');
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
            <p>User: {{ user.name }}</p>
          </div>

          <a class="button is-light" @click="handleLogOut"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

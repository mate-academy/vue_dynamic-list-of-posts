<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    }
  },
  methods: {
    onLogout() {
      localStorage.removeItem('user');
      this.$router.push('./login');
    }
  }
});
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
            <p>User: {{name}}</p>
          </div>

          <a @click="onLogout" class="button is-light"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

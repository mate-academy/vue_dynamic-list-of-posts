<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\NeedToRegister.vue -->
<template>
  <div class="field">
    <label class="label" for="user-name">Your Name</label>

    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        v-model="name"
        required
        :minlength="4"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
    </div>

    <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'NeedToRegister',
  data() {
    return {
      name: '',
      errorMessage: '',
    };
  },
  watch: {
    name(value) {
      if (value.length < 4) {
        this.errorMessage = 'Name must be at least 4 characters long.';
      } else {
        this.errorMessage = '';
      }
    },
  },
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
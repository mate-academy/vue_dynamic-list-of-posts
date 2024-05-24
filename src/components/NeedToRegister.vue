<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left" :class="{ 'is-loading': isLoading }">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        minlength="{4}"
        :value="username"
        :disabled="isLoading"
        @input="$emit('update:username', $event.target.value)"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  props: {
    username: String,
    errorMessage: String,
    isLoading: Boolean
  }
};
</script>

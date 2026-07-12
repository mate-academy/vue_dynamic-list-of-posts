<template>
  <form @submit.prevent="$emit('submit')" class="box mt-5">
    <h1 class="title is-3">Get your userId</h1>

    <div class="field">
      <label class="label" for="user-email"> Email </label>

      <div class="control has-icons-left">
        <input
          type="email"
          id="user-email"
          name="email"
          class="input"
          placeholder="Enter your email"
          :value="loginInput"
          :class="{ 'is-danger': errorMessageLogin }"
          @input="$emit('input', $event)"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
      </div>

      <p v-if="errorMessageLogin" class="help is-danger">
        {{ errorMessageLogin }}
      </p>
    </div>

    <div class="field">
      <button
        type="submit"
        class="button is-primary"
        :class="{ 'is-loading': loadingLogin }"
        :disabled="loadingLogin"
      >
        {{ loadingLogin ? "" : "Login" }}
      </button>
    </div>
  </form>
</template>

<script setup>
defineProps({
  loginInput: String,
  errorMessageLogin: String,
  loadingLogin: Boolean,
});

defineEmits(["submit", "input"]);
</script>
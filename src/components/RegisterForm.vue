<template>
  <form @submit.prevent="$emit('submit')" class="box mt-5">
    <h1 class="title is-3">You need to register</h1>

    <div class="field">
      <label class="label" for="user-email"> Email </label>

      <div class="control has-icons-left">
        <input
          type="email"
          id="user-email"
          name="email"
          class="input"
          placeholder="Enter your email"
          required
          :value="loginInput"
          disabled
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
      </div>

      <div class="field">
        <label class="label" for="user-name"> Your Name </label>

        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            class="input"
            placeholder="Enter your name"
            minlength="4"
            :class="{ 'is-danger': errorMessageRegister }"
            :value="userName"
            @input="$emit('input', $event)"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <p v-if="errorMessageRegister" class="help is-danger">
          {{ errorMessageRegister }}
        </p>
      </div>
    </div>

    <div class="field">
      <button
        type="submit"
        class="button is-primary"
        :class="{ 'is-loading': loadingRegister }"
        :disabled="loadingRegister"
      >
        {{ loadingRegister ? "" : "Register" }}
      </button>
    </div>
  </form>
</template>

<script setup>
defineProps({
  loginInput: String,
  userName: String,
  errorMessageRegister: String,
  loadingRegister: Boolean,
});

defineEmits(["submit", "input"]);
</script>
<script>
import { getUser } from "../api/users.js";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  methods: {
    handleSubmit() {
      this.errorMessage = "";
      this.isLoading = true;

      getUser(this.email)
        .then((user) => {
          if (user) {
            this.$emit("login", user);
          } else {
            this.errorMessage = "User not found";
          }
        })
        .catch(() => {
          this.errorMessage = "Login error";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            class="input"
            :class="{ 'is-danger': errorMessage }"
            :disabled="isLoading"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p class="help is-danger">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
        >
          Login
        </button>
      </div>
    </form>
  </section>
</template>

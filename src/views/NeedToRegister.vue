<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p v-if="hasError" class="help is-danger">{{ errorMessage }}</p>
      </div>

      <button type="submit" class="button is-link">Register</button>
    </form>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      hasError: false,
      errorMessage: ""
    };
  },
  methods: {
    async handleSubmit() {
      try {
        await axios.post("https://mate-academy.github.io/fe-students-api/register", {
          email: this.email
        });
        alert("Registration successful!");
      } catch (error) {
        this.hasError = true;
        this.errorMessage = "Failed to register. Please try again.";
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
}
</style>

<script>
import { getUserbyEmail, createUser } from "../api/users";

export default {
  emits: ["addUser"],

  data() {
    return {
      email: "",
      name: "",
      errors: {},
      isRegistering: false,
    };
  },

  computed: {
    formTitle() {
      return this.isRegistering ? "You need to register" : "Get your userId";
    },
    submitText() {
      return this.isRegistering ? "Register" : "Login";
    },
  },

  methods: {
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },

    validateEmail() {
      const trimmedEmail = this.email.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!trimmedEmail) {
        this.errors.email = "Email is required";
        return false;
      }

      if (!emailRegex.test(trimmedEmail)) {
        this.errors.email = "Email is not valid";
        return false;
      }

      this.clearError("email");
      return true;
    },

    validateName() {
      const trimmedName = this.name.trim();

      if (!trimmedName) {
        this.errors.name = "Name is required";
        return false;
      }

      if (trimmedName.length < 2) {
        this.errors.name = "Name must have at least 2 chars";
        return false;
      }

      this.clearError("name");
      return true;
    },

    async handleLogin() {
      if (!this.validateEmail()) return;

      try {
        const { data } = await getUserbyEmail(this.email.trim());

        if (!data.length) {
          this.isRegistering = true;
          return;
        }

        this.$emit("addUser", data[0]);
      } catch (error) {
        console.error(error);
        this.errors.server = "Server Error. Try again later!";
      }
    },

    async handleRegister() {
      if (!this.validateEmail() || !this.validateName()) return;

      try {
        const userData = {
          name: this.name.trim(),
          email: this.email.trim(),
          username: null,
          phone: null,
        };

        const { data } = await createUser(userData);

        this.$emit("addUser", data);
      } catch (error) {
        console.error(error);
        this.errors.server = "Server Error. Try again later!";
      }
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form
      class="box mt-5"
      @submit.prevent="isRegistering ? handleRegister() : handleLogin()"
      novalidate
    >
      <h1 class="title is-3">{{ formTitle }}</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>

        <div class="control has-icons-left" :class="{ 'has-icons-right': errors.email }">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-danger': errors.email }"
            placeholder="Enter your email"
            @input="clearError('email')"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>

          <span class="icon is-small is-right has-text-danger" v-if="errors.email">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errors.email">{{ errors.email }}</p>
      </div>

      <div class="field" v-if="isRegistering">
        <label class="label" for="user-name">Name</label>

        <div class="control has-icons-left" :class="{ 'has-icons-right': errors.name }">
          <input
            v-model="name"
            type="text"
            id="user-name"
            name="name"
            class="input"
            :class="{ 'is-danger': errors.name }"
            placeholder="Enter your name"
            @input="clearError('name')"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span class="icon is-small is-right has-text-danger" v-if="errors.name">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errors.name">{{ errors.name }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ submitText }}
        </button>
      </div>

      <p class="help is-danger" v-if="errors.server">{{ errors.server }}</p>
    </form>
  </section>
</template>

<style></style>
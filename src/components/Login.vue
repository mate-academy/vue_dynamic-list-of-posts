<script>
import { getUser } from '../api/users.js';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      errorMessage: '',
      isLoading: false,
    };
  },
  emits: ['login'],
  methods: {
    async handleSubmit() {
      this.errorMessage = '';
      this.isLoading = true;

      try {
        const user = await getUser(this.email.trim());

        if (!user) {
          this.errorMessage = 'User not found';
          return;
        }

        this.$emit('login', user);
      } catch {
        this.errorMessage = 'Login error';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleSubmit">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>

        <div class="control has-icons-left">
          <input
            id="user-email"
            v-model="email"
            type="email"
            name="email"
            class="input"
            :class="{ 'is-danger': errorMessage }"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
          />

          <span class="icon is-small is-left" aria-hidden="true">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }" :disabled="isLoading">
          Login
        </button>
      </div>
    </form>
  </section>
</template>

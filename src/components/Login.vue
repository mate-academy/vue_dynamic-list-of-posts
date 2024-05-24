<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">
        {{ showRegisterForm ? 'You need to register' : 'Get your userId' }}
      </h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left" :class="{ 'is-loading': isLoading }">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            :value="email"
            :disabled="showRegisterForm || isLoading"
            @input="$emit('update:email', $event.target.value)"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
      </div>

      <RegisterForm
        v-if="showRegisterForm"
        :errorMessage="errorMessage"
        :isLoading="isLoading"
        @update:username="handleUpdateUsername"
      />

      <div class="field">
        <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">
          {{ showRegisterForm ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import RegisterForm from './NeedToRegister.vue';

export default {
  name: 'LoginForm',
  components: {
    RegisterForm
  },
  props: {
    email: String,
    username: String,
    errorMessage: String,
    showRegisterForm: Boolean,
    isLoading: Boolean
  },
  methods: {
    handleSubmit() {
      this.$emit('submit');
    },
    handleUpdateUsername(username) {
      this.$emit('update:username', username);
    }
  }
};
</script>

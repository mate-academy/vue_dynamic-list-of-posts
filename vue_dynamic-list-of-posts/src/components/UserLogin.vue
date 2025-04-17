<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">{{ step === 1 ? 'Get your userId' : 'You need to register' }}</h1>

      <!-- Email Input Field -->
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
            :disabled="step === 2 || isLoading"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
      </div>

      <!-- Name Input Field (Step 2) -->
      <div v-if="step === 2" class="field">
        <label class="label" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            name="name"
            class="input"
            placeholder="Enter your name"
            v-model="name"
            :disabled="isLoading"
            minlength="4"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
        <p class="help is-danger" v-if="nameError">{{ nameError }}</p>
      </div>

      <!-- Submit Button -->
      <div class="field">
        <button type="submit" class="button is-primary" :disabled="isLoading">
          <template v-if="isLoading">
            <AppLoader size="20"/>
          </template>
          <template v-else>
            {{ step === 1 ? 'Login' : 'Register' }}
          </template>
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import AppLoader from './loader/AppLoader.vue';

export default {
  name: 'UserLogin',
  components: {
    AppLoader, // Register the loader component
  },
  data() {
    return {
      step: 1, // Step 1: Email input, Step 2: Name input
      email: '',
      name: '',
      errorMessage: '',
      nameError: '',
      isLoading: false, 
    };
  },
  methods: {
    async handleSubmit() {
      if (this.step === 1) {
        // Step 1: Validate Email
        if (!this.validateEmail(this.email)) {
          this.errorMessage = 'Please enter a valid email address.';
        } else {
          this.errorMessage = '';
          this.isLoading = true; // Start loading
          setTimeout(() => {
            const user = JSON.parse(localStorage.getItem(this.email));
            if (user) {
              // User exists, emit login event
              this.$emit('login', this.email);
            } else {
              // User does not exist, move to Step 2
              this.step = 2;
            }
            this.isLoading = false; // Stop loading
          }, 1000); // Simulate a 1-second delay
        }
      } else if (this.step === 2) {
        // Step 2: Validate Name
        if (this.name.trim().length < 4) {
          this.nameError = 'Name must be at least 4 characters long.';
        } else {
          this.nameError = '';
          this.isLoading = true; // Start loading
          setTimeout(() => {
            // Emit register event
            this.$emit('register', { email: this.email, name: this.name });
            this.isLoading = false; // Stop loading
          }, 1000); // Simulate a 1-second delay
        }
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^@]+@[^@]+$/;
      return emailRegex.test(email);
    },
  },
};
</script>
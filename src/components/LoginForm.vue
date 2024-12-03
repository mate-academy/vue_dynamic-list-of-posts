<script>
import RegisterField from './RegisterField.vue';
export default {
  name: 'AuthForm',
  props: {
    isUserAuthorized: Boolean,
    hasFormBeenSubmitted: Boolean,
  },
  emits: ['updateName', 'updateEmail', 'submitForm'],
  components: {
    RegisterField,
  },
  methods: {
    handleNameUpdate(value) {
      this.$emit('updateName', value);
    },
    handleEmailUpdate(event) {
      this.$emit('updateEmail', event.target.value);
    },
    handleFormSubmit(event) {
      this.$emit('submitForm', event);
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleFormSubmit" class="box mt-5">
      <h1 class="title is-3">{{ hasFormBeenSubmitted ? 'You need to register' : 'Log in' }}</h1>

      <div class="field">
        <label class="label" for="email-input">Email</label>
        <div class="control has-icons-left">
          <input
            id="email-input"
            type="email"
            name="email"
            class="input"
            placeholder="Enter your email"
            :disabled="hasFormBeenSubmitted"
            required
            @input="handleEmailUpdate"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <RegisterField
        v-if="!isUserAuthorized && hasFormBeenSubmitted"
        @change-name="handleNameUpdate"
      />

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ hasFormBeenSubmitted ? 'Register' : 'Log in' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import RegisterField from './RegisterField.vue';
export default {
  name: 'LoginForm',
  props: {
    isAuthorized: Boolean,
    isSubmitted: Boolean,
  },
  emits: ['changeName', 'changeEmail', 'handleSubmit'],
  components: {
    RegisterField,
  },
  methods: {
    onChangeName(value) {
      this.$emit('changeName', value);
    },
    onChangeEmail(event) {
      this.$emit('changeEmail', event.target.value);
    },
    onSubmit(event) {
      this.$emit('handleSubmit', event);
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="onSubmit" class="box mt-5">
      <h1 class="title is-3">{{ isSubmitted ? 'You need to register' : 'Log in' }}</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            @input="onChangeEmail"
            required
            :disabled="isSubmitted"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <RegisterField
        v-if="!isAuthorized && isSubmitted"
        @change-name="onChangeName"
      />

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isSubmitted ? 'Register' : 'Log in' }}
        </button>
      </div>
    </form>
  </section>
</template>

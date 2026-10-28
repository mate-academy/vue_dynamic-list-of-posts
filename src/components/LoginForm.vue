<script setup>
import { ref } from 'vue';

defineProps({
  errorMessage: {
    type: String,
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  }
});

const email = ref('');
const emit = defineEmits(['submit-form']);

const handleSubmit = () => {
  emit('submit-form', email.value);
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
          name="email"
          class="input"
          placeholder="Enter your email"
          required
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
      </div>

        <p v-if="hasError" class="help is-danger" data-cy="ErrorMessage">
            {{ errorMessage }}
        </p>
    </div>

    <div class="field">
      <button type="submit" class="button is-primary">Login</button>
    </div>
  </form>
</section>

</template>

<style scoped></style>
<script setup>
import { ref } from 'vue';

defineProps({
  email: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  hasError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['register']);

const name = ref('');

const handleSubmit = () => {
  emit('register', name.value);
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label">Email</label>

        <input
          :value="email"
          type="email"
          class="input"
          disabled
        />
      </div>

      <div class="field">
        <label class="label" for="user-name">Your Name</label>

        <div class="control has-icons-left">
          <input
            v-model="name"
            type="text"
            id="user-name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <p v-if="hasError" class="help is-danger">
          {{ errorMessage }}
        </p>
      </div>

      <button type="submit" class="button is-primary">
        Register
      </button>
    </form>
  </section>
<!-- <div class="field">
  <label class="label" for="user-name"> Your Name </label>

  <div class="control has-icons-left">
    <input
      v-model="name"
      type="text"
      id="user-name"
      name="name"
      class="input"
      placeholder="Enter your name"
      required
      minlength="4"
    />

    <span class="icon is-small is-left">
      <i class="fas fa-user" />
    </span>
  </div>
    <p v-if="hasError" class="help is-danger" data-cy="ErrorMessage">
        {{ errorMessage }}
    </p>
</div> -->
</template>

<style scoped></style>
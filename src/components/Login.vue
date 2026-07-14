<script setup>
import { ref } from 'vue';

import { getUsersByEmail, createUser } from '../api/api';

const emit = defineEmits(['logged-in']);

const email = ref('');
const name = ref('');
const isRegisterMode = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const handleEmailSubmit = async () => {
  if (!email.value) return;

  errorMessage.value = '';
  isLoading.value = true;

  try {
    const users = await getUsersByEmail(email.value.trim().toLowerCase());
    
    if (users && users.length > 0) {
      emit('logged-in', users[0]);
    } else {
      isRegisterMode.value = true;
    }
  } catch (error) {
    errorMessage.value = 'Failed to log in. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleRegisterSubmit = async () => {
  if (!name.value || !email.value) return;

  if (name.value.trim().length < 4) {
    errorMessage.value = 'Name must be at least 4 characters long';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    const newUser = await createUser({
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
    });
    emit('logged-in', newUser);
  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form
      v-if="!isRegisterMode"
      @submit.prevent="handleEmailSubmit"
      class="box mt-5"
    >
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
            :disabled="isLoading"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading"
        >
          Login
        </button>
      </div>
    </form>

    <form
      v-else
      @submit.prevent="handleRegisterSubmit"
      class="box mt-5"
    >
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
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
            :disabled="isLoading"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading"
        >
          Register
        </button>
      </div>
    </form>
  </section>
</template>

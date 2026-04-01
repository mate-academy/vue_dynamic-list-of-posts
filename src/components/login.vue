<script setup lang="ts">
import { ref } from 'vue';
import { User } from '../types/User';
import client from '../utils/http';

const emit = defineEmits<{
  (e: 'login', user: User): void
}>();

const userEmail = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  if (!userEmail.value.trim()) {
    errorMessage.value = 'Please enter your email';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await client.get<User[]>(`/users?email=${encodeURIComponent(userEmail.value.trim())}`);
    if (response.data.length === 0) {
      errorMessage.value = 'User not found. Please check your email.';
    } else {
      emit('login', response.data[0]);
    }
  } catch {
    errorMessage.value = 'Server error. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            v-model="userEmail"
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-danger': errorMessage }"
            placeholder="Enter your email"
            @input="errorMessage = ''"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
        >
          Login
        </button>
      </div>
    </form>
  </section>
</template>
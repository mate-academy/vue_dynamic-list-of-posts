<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login']);
const email = ref('');
const error = ref(''); // Замість alert використовуємо реактивну змінну
const isLoading = ref(false);

const BASE_URL = 'https://mate.academy/students-api';

async function handleSubmit() {
  // Очищаємо попередні помилки
  error.value = '';
  
  if (!email.value) {
    error.value = 'Please enter your email';
    return;
  }

  isLoading.value = true;

  try {
    const res = await fetch(`${BASE_URL}/users?email=${email.value.trim()}`);
    
    if (!res.ok) {
      throw new Error('Server error');
    }

    const users = await res.json();

    if (users.length === 0) {
      error.value = 'User not found. Please check your email.';
      return;
    }

    const user = users[0];
    emit('login', user);
  } catch (err) {
    console.error(err);
    // ВИПРАВЛЕНО: друкарську помилку 'allert' видалено, використовуємо UI
    error.value = 'Login failed. Please check your connection and try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5" style="min-width: 320px;">
      <h1 class="title is-3">Login</h1>

      <div v-if="error" class="notification is-danger is-light">
        <button class="delete" type="button" @click="error = ''"></button>
        {{ error }}
      </div>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input 
            v-model="email" 
            type="email" 
            id="user-email" 
            class="input" 
            :class="{ 'is-danger': error }"
            placeholder="Enter your email" 
            required 
            :disabled="isLoading"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <button 
          type="submit" 
          class="button is-primary is-fullwidth"
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading"
        >
          Login
        </button>
      </div>
    </form>
  </section>
</template>
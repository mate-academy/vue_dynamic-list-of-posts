<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login']);

const loginStep = ref(1);
const emailInput = ref('');
const nameInput = ref('');
const loginError = ref('');

const handleLogin = () => {
  loginError.value = '';
  if (loginStep.value === 1) {
    if (!emailInput.value.includes('@')) {
      loginError.value = 'Podaj poprawny email!';
      return;
    }
    loginStep.value = 2;
  } else {
    if (nameInput.value.length < 2) {
      loginError.value = 'Imię jest za krótkie!';
      return;
    }
    emit('login', { name: nameInput.value, email: emailInput.value });
  }
};
</script>

<template>
  <div class="section is-flex is-justify-content-center is-align-items-center min-vh-100">
    <div class="box p-6" style="max-width: 400px; width: 100%;">
      <h1 class="title is-4 has-text-centered">Get your userId</h1>
      <form @submit.prevent="handleLogin">
        <div v-if="loginStep === 1" class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left">
            <input v-model="emailInput" class="input force-light-input" type="email" placeholder="Enter your email" required />
            <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
          </div>
        </div>
        <div v-else class="field">
          <label class="label">Name</label>
          <div class="control has-icons-left">
            <input v-model="nameInput" class="input force-light-input" type="text" placeholder="Enter your name" required />
            <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
          </div>
        </div>
        <p v-if="loginError" class="help is-danger">{{ loginError }}</p>
        <button type="submit" class="button is-success is-fullwidth mt-4">
          {{ loginStep === 1 ? 'Next' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

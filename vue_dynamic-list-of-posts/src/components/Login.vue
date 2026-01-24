<script setup>
import { ref, watch } from 'vue';
import { login } from '@/api/users';

const email = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const emit = defineEmits(['login', 'register']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleSubmit() {
  if (!emailPattern.test(email.value)) {
    errorMessage.value = 'Enter correct email';
    return;
  }

  isLoading.value = true;
  try {
    const user = await login({ email: email.value });
    if (user) {
      emit('login', user)
    } else {
      emit('register', { email: email.value })
    }
  } catch (error) {
    errorMessage.value = 'Network error'
  } finally {
    isLoading.value = false;
  }
}

watch(email, () => {
  errorMessage.value = ''
})
</script>
<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleSubmit">
      <h1 class="title is-3">You need to login</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input type="email" id="user-email" name="email" class="input" placeholder="Enter your email" required
            v-model="email" :disabled="isLoading" />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <button type="submit" :class="['button is-primary', { 'is-loading': isLoading }]"
          :disabled="isLoading">Login</button>
      </div>
    </form>
  </section>
</template>

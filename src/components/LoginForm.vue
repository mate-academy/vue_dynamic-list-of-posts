<script setup lang="ts">
import { ref, computed } from 'vue';
import type { User } from '@/types/User';
import { client } from '@/api/fetchClient';

const emit = defineEmits<{ login: [user: User] }>();

const email = ref('');
const name = ref('');
const username = ref('');
const phone = ref('');
const emailError = ref<string | null>(null);
const nameError = ref<string | null>(null);
const loading = ref(false);
const showRegister = ref(false);
const submitError = ref<string | null>(null);

const isEmailValid = computed(() => email.value.includes('@') && email.value.includes('.'));

async function handleEmailSubmit(event: Event): Promise<void> {
  event.preventDefault();
  if (loading.value) return;
  emailError.value = null;
  submitError.value = null;

  if (!isEmailValid.value) {
    emailError.value = 'Invalid email';
    return;
  }

  loading.value = true;
  try {
    const users = await client.get<User[]>(`/users?email=${encodeURIComponent(email.value)}`);
    if (users.length > 0) {
      emit('login', users[0]);
    } else {
      showRegister.value = true;
      username.value = email.value.split('@')[0];
      phone.value = '';
    }
  } catch {
    submitError.value = 'Network error. Please try again.';
  } finally {
    loading.value = false;
  }
}

async function handleRegisterSubmit(event: Event): Promise<void> {
  event.preventDefault();
  if (loading.value) return;
  nameError.value = null;
  submitError.value = null;

  if (!name.value.trim()) {
    nameError.value = 'Name is required';
    return;
  }
  if (name.value.trim().length < 4) {
    nameError.value = 'Name must be at least 4 characters';
    return;
  }

  loading.value = true;
  try {
    const newUser = await client.post<User>('/users', {
      name: name.value.trim(),
      username: username.value.trim() || email.value.split('@')[0],
      email: email.value,
      phone: phone.value.trim() || '0000000000',
    });
    emit('login', newUser);
  } catch {
    submitError.value = 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
}

function handleSubmit(event: Event): Promise<void> {
  return showRegister.value ? handleRegisterSubmit(event) : handleEmailSubmit(event);
}

function handleEmailInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  email.value = target.value;
  if (emailError.value) emailError.value = null;
  if (submitError.value) submitError.value = null;
}

function handleNameInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  name.value = target.value;
  if (nameError.value) nameError.value = null;
  if (submitError.value) submitError.value = null;
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit="handleSubmit" class="box mt-5">
      <h1 class="title is-3">{{ showRegister ? 'You need to register' : 'Login' }}</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-danger': emailError }"
            placeholder="Enter your email"
            required
            :value="email"
            @input="handleEmailInput"
            :disabled="loading"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>
        <p v-if="emailError" class="help is-danger">{{ emailError }}</p>
      </div>

      <div v-if="showRegister" class="field">
        <label class="label" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            name="name"
            class="input"
            :class="{ 'is-danger': nameError }"
            placeholder="Enter your name"
            required
            minlength="4"
            :value="name"
            @input="handleNameInput"
            :disabled="loading"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>
        <p v-if="nameError" class="help is-danger">{{ nameError }}</p>
      </div>

      <p v-if="submitError" class="help is-danger">{{ submitError }}</p>

      <div class="field">
        <div class="control">
          <button type="submit" class="button is-primary" :class="{ 'is-loading': loading }" :disabled="loading">
            {{ showRegister ? 'Register' : 'Login' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
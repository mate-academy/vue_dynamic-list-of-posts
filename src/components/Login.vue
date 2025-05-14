<script setup>
import { ref } from 'vue';
import { getUserByEmail, addUser } from '@/helpers/users';
import NeedToRegister from './NeedToRegister.vue';

const email = ref('');
const name = ref('');
const errorMessage = ref('');
const showNameInput = ref(false);
const isSubmitting = ref(false);

const handleSubmit = async () => {
  errorMessage.value = '';
  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = 'Please enter a valid email address';
    return;
  }

  isSubmitting.value = true;

  try {
    const user = await getUserByEmail(email.value);

    if (user) {
      emit('addUser', user);
    } else {
      showNameInput.value = true;
    }

  } catch (e) {
    errorMessage.value = 'An error occurred during login.';
  } finally {
    isSubmitting.value = false;
  }
};

const handleRegister = async () => {
  errorMessage.value = '';
  if (name.value.length < 4) {
    errorMessage.value = 'Name must be at least 4 characters';
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await addUser({
      name: name.value,
      email: email.value,
      username: null,
      phone: null,
    });

    emit('addUser', response);
  } catch (e) {
    errorMessage.value = 'Registration failed.';
  } finally {
    isSubmitting.value = false;
  }
};

const emit = defineEmits(['addUser']);
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="showNameInput ? handleRegister() : handleSubmit()" class="box mt-5">
      <h1 class="title is-3">
        {{ showNameInput ? 'You need to register' : 'Get your userID' }}
      </h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input v-model="email" type="email" id="user-email" class="input" placeholder="Enter your email" required />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>
      </div>

      <NeedToRegister v-if="showNameInput" v-model="name" @update:modelValue="name = $event" />

      <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>

      <div class="field">
        <button type="submit" class="button is-primary" :disabled="isSubmitting">
          {{ showNameInput ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

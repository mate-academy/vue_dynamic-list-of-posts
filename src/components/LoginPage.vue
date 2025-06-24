<script setup>
import { ref, computed } from 'vue';
import { getUserByEmail, createUser } from '@/api/users';

const emit = defineEmits(['addUser']);

const email = ref('');
const name = ref('');
const errors = ref({});
const isRegistering = ref(false);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
};

const validateEmail = () => {
  const trimmedEmail = email.value.trim();

  if (!trimmedEmail) {
    errors.value.email = 'Email is required';

    return false;
  }

  if (!emailRegex.test(trimmedEmail)) {
    errors.value.email = 'Email is not valid';

    return false;
  }

  clearError('email');

  return true;
};

const validateName = () => {
  const trimmedName = name.value.trim();

  if (!trimmedName) {
    errors.value.name = 'Name is required';

    return false;
  }

  if (trimmedName.length < 2) {
    errors.value.name = 'Name must have at least 2 chars';

    return false;
  }

  clearError('name');

  return true;
};

const handleLogin = async () => {
  if (!validateEmail()) {
    return;
  }

  try {
    const { data } = await getUserByEmail(email.value.trim());

    if (!data.length) {
      isRegistering.value = true;

      return;
    }

    emit('addUser', data[0]);
  } catch (error) {
    console.error(error);
    errors.value.server = 'Server Error. Try again later!';
  }
};

const handleRegister = async () => {
  if (!validateEmail() || !validateName()) {
    return;
  }

  try {
    const userData = {
      name: name.value.trim(),
      email: email.value.trim(),
      username: null,
      phone: null,
    };

    const { data } = await createUser(userData);

    emit('addUser', data);
  } catch (error) {
    console.error(error);
    errors.value.server = 'Server Error. Try again later!';
  }
};

const formTitle = computed(() =>
  isRegistering.value ? 'You need to register' : 'Get your userId',
);

const submitText = computed(() => (isRegistering.value ? 'Register' : 'Login'));
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form
      class="box mt-5"
      @submit.prevent="isRegistering ? handleRegister() : handleLogin()"
      novalidate
    >
      <h1 class="title is-3">{{ formTitle }}</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>

        <div class="control has-icons-left" :class="{ 'has-icons-right': errors.email }">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-danger': errors.email }"
            placeholder="Enter your email"
            @input="clearError('email')"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>

          <span class="icon is-small is-right has-text-danger" v-if="errors.email">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errors.email">{{ errors.email }}</p>
      </div>

      <div class="field" v-if="isRegistering">
        <label class="label" for="user-name">Name</label>

        <div class="control has-icons-left" :class="{ 'has-icons-right': errors.name }">
          <input
            v-model="name"
            type="text"
            id="user-name"
            name="name"
            class="input"
            :class="{ 'is-danger': errors.name }"
            placeholder="Enter your name"
            @input="clearError('name')"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span class="icon is-small is-right has-text-danger" v-if="errors.name">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errors.name">{{ errors.name }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ submitText }}
        </button>
      </div>

      <p class="help is-danger" v-if="errors.server">{{ errors.server }}</p>
    </form>
  </section>
</template>

<style></style>

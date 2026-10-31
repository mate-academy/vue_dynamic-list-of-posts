<script setup>
import { ref, watch } from 'vue';
import { createUser, getUserByEmail } from '../api';
import InputField from './InputField.vue';

const emit = defineEmits(['login']);

const email = ref('');
const name = ref('');
const needsRegister = ref(false);
const emailError = ref('');
const nameError = ref('');
const loading = ref(false);

watch(email, () => {
  emailError.value = '';
  needsRegister.value = false;
});
watch(name, () => (nameError.value = ''));

async function handleSubmit() {
  const value = email.value.trim();

  if (!/^\S+@\S+\.\S+$/.test(value)) {
    emailError.value = 'Enter a valid email';

    return;
  }

  if (needsRegister.value && name.value.trim().length < 4) {
    nameError.value = 'Name must have at least 4 characters';

    return;
  }

  loading.value = true;

  try {
    if (!needsRegister.value) {
      const user = await getUserByEmail(value);

      if (user) {
        emit('login', user);
      } else {
        needsRegister.value = true;
      }

      return;
    }

    const user = await createUser({
      name: name.value.trim(),
      username: name.value.trim(),
      email: value,
    });

    emit('login', user);
  } catch {
    emailError.value = 'Something went wrong. Try again';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" novalidate @submit.prevent="handleSubmit">
      <h1 class="title is-3">
        {{ needsRegister ? 'You need to register' : 'Log in' }}
      </h1>

      <InputField
        v-model="email"
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        icon="fa-envelope"
        :error="emailError"
        data-cy="EmailField"
      />

      <InputField
        v-if="needsRegister"
        v-model="name"
        label="Your Name"
        name="name"
        placeholder="Enter your name"
        :error="nameError"
        data-cy="NameField"
      />

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': loading }"
        >
          {{ needsRegister ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

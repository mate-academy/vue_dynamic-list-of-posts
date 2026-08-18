<script setup>
import { reactive, ref } from 'vue';
import { createUser, getUserByEmail } from '../api/users.js';
import { validateLogin } from '../utils/validation.js';
import InputField from './InputField.vue';

const emit = defineEmits(['authenticated']);

const form = reactive({
  email: '',
  name: '',
});
const errors = reactive({});
const registrationRequired = ref(false);
const submitting = ref(false);
const serverError = ref('');

function clearError(field) {
  delete errors[field];
  serverError.value = '';

  if (field === 'email' && registrationRequired.value) {
    registrationRequired.value = false;
    form.name = '';
    delete errors.name;
  }
}

async function submit() {
  Object.keys(errors).forEach(key => delete errors[key]);
  serverError.value = '';

  const nextErrors = validateLogin({
    ...form,
    registrationRequired: registrationRequired.value,
  });

  Object.assign(errors, nextErrors);

  if (Object.keys(nextErrors).length > 0) {
    return;
  }

  submitting.value = true;

  try {
    if (registrationRequired.value) {
      const user = await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
      });

      emit('authenticated', user);
      return;
    }

    const user = await getUserByEmail(form.email.trim());

    if (user) {
      emit('authenticated', user);
      return;
    }

    registrationRequired.value = true;
  } catch (error) {
    serverError.value = error.message || 'Unable to continue. Please try again.';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="container login-shell is-flex is-justify-content-center" data-cy="LoginForm">
    <form class="box login-card" novalidate @submit.prevent="submit">
      <h1 class="title is-3">
        {{ registrationRequired ? 'You need to register' : 'Welcome back' }}
      </h1>

      <p class="subtitle is-6">
        {{
          registrationRequired
            ? 'No account was found. Add your name to create one.'
            : 'Enter your email to load your posts.'
        }}
      </p>

      <InputField
        v-model="form.email"
        name="user-email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        icon="fa-envelope"
        data-cy="EmailField"
        autocomplete="email"
        :error="errors.email"
        @change="clearError('email')"
      />

      <InputField
        v-if="registrationRequired"
        v-model="form.name"
        name="user-name"
        label="Your Name"
        placeholder="Enter your name"
        icon="fa-user"
        data-cy="NameField"
        autocomplete="name"
        :error="errors.name"
        @change="clearError('name')"
      />

      <div v-if="serverError" class="notification is-danger is-light" data-cy="LoginError">
        {{ serverError }}
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': submitting }"
          :disabled="submitting"
        >
          {{ registrationRequired ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

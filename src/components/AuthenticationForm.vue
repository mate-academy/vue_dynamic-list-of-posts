<script setup>
  import { ref } from 'vue';
  import Input from './Input.vue';
  import { ERROR_MESSAGES } from '@/utils/errorMessages';
  import { createUser, getUserByEmail } from '@/api/users';
  import { setUser } from '@/utils/userLocalStorageManagement';
  import { EMAIL_PATTERN } from '@/utils/emailRegex';

  const INITIAL_ERRORS = {
    emailError: ERROR_MESSAGES.NONE,
    nameError: ERROR_MESSAGES.NONE,
  };

  const user = defineModel('user', { type: Object });

  const email = ref('');
  const name = ref('');
  const errors = ref({ ...INITIAL_ERRORS });
  const isRegisterFormShown = ref(false);

  const onLogin = async () => {
    errors.value = { ...INITIAL_ERRORS };

    if (!email.value.trim()) {
      errors.value.emailError = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!EMAIL_PATTERN.test(email.value.trim())) {
      errors.value.emailError = ERROR_MESSAGES.EMAIL_INVALID;
    }

    if (errors.value.emailError || errors.value.nameError) {
      return;
    }

    try {
      const fetchedUser = (await getUserByEmail(email.value))[0];

      if (!fetchedUser) {
        isRegisterFormShown.value = true;

        return;
      }

      setUser(fetchedUser);
      user.value = fetchedUser;
    } catch (error) {
      console.error(error);
    }
  };

  const onRegister = async () => {
    errors.value = { ...INITIAL_ERRORS };

    if (!name.value.trim()) {
      errors.value.nameError = ERROR_MESSAGES.NAME_REQUIRED;
    }

    if (errors.value.emailError || errors.value.nameError) {
      return;
    }

    try {
      const newUser = await createUser(email.value, name.value);

      setUser(newUser);
      user.value = newUser;
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = () => {
    isRegisterFormShown.value ? onRegister() : onLogin();
  };
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="onSubmit">
      <h1 class="title is-3">Get your userId</h1>

      <Input
        v-model="email"
        v-model:error="errors.emailError"
        title="Email"
        placeholder="Enter your email"
        icon="fa-envelope"
        :disabled="isRegisterFormShown"
        type="email"
      />

      <Input
        v-if="isRegisterFormShown"
        v-model="name"
        v-model:error="errors.nameError"
        title="Your name"
        placeholder="Enter your name"
        icon="fa-user"
      />

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isRegisterFormShown ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

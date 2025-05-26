<script setup>
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import InputField from '../components/modules/InputField.vue';

const userStore = useUserStore();
const router = useRouter();

async function handleRegister() {
  userStore.errorMessages.name = null;
  userStore.errorMessages.username = null;
  userStore.errorMessages.email = null;
  userStore.errorMessages.phone = null;
  userStore.errorMessages.fetch = null;

  let hasError = false;

  if (!userStore.newUser.name.trim()) {
    userStore.errorMessages.name = 'Name is required';
    hasError = true;
  }

  if (!userStore.newUser.username.trim()) {
    userStore.errorMessages.username = 'Username is required';
    hasError = true;
  }

  if (!userStore.newUser.email.trim()) {
    userStore.errorMessages.email = 'Email is required';
    hasError = true;
  }

if (!userStore.newUser.phone.trim()) {
    userStore.errorMessages.phone = 'Phone is required';
    hasError = true;
  } else if (!/^[0-9]+$/.test(userStore.newUser.phone)) {
    userStore.errorMessages.phone = 'Phone must contain only numbers';
    hasError = true;
  }

  if (hasError) {
    return;
  }
  try {
    await userStore.createNewUser();
    router.push('/login');
  } catch (err) {
    userStore.errorMessages.fetch = 'Error adding post: ' + err.message;
  }
}

function clearNameError() {
  if (userStore.newUser.name.trim()) userStore.errorMessages.name = null;
}

function clearUsernameError() {
  if (userStore.newUser.username.trim())
    userStore.errorMessages.username = null;
}

function clearEmailError() {
  if (userStore.newUser.email.trim()) userStore.errorMessages.email = null;
}

function clearPhoneError() {
  if (userStore.newUser.phone.trim()) userStore.errorMessages.phone = null;
}
</script>
<template>
  <div class="is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleRegister" style="max-width: 500px">
      <div class="field">
        <InputField
          :label="'Your name'"
          :input-id="'userName'"
          :placeholder="'Enter your name'"
          :icon-left="'fas fa-user'"
          :error-message="userStore.errorMessages.name"
          v-model="userStore.newUser.name"
          @input="clearNameError"
        />
      </div>
      <div class="field">
        <InputField
          :label="'Your username'"
          :input-id="'userUsername'"
          :placeholder="'Enter your username'"
          :error-message="userStore.errorMessages.username"
          v-model="userStore.newUser.username"
          @input="clearUsernameError"
        />
      </div>
      <div class="field">
        <InputField
          :label="'Your email'"
          :input-id="'userEmail'"
          :type="'email'"
          :icon-left="'fas fa-envelope'"
          :placeholder="'Enter your email'"
          :error-message="userStore.errorMessages.email"
          v-model="userStore.newUser.email"
          @input="clearEmailError"
        />
      </div>
      <div class="field">
        <InputField
          :label="'Your phone'"
          :input-id="'userPhone'"
          :type="'tel'"
          :icon-left="'fa-solid fa-phone'"
          :placeholder="'Enter your phone'"
          :error-message="userStore.errorMessages.phone"
          v-model="userStore.newUser.phone"
          @input="clearPhoneError"
        />
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">Register now</button>
        </div>
      </div>
    </form>
  </div>
</template>

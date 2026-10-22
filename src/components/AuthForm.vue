<script setup>
import { ref } from 'vue';
import { api } from '../api';
const emit = defineEmits(['login']);
const email = ref('');
const name = ref('');
const register = ref(false);
const busy = ref(false);
const error = ref('');
function changeEmail() { register.value = false; error.value = ''; }
async function submit() {
  if (busy.value) return;
  error.value = '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    error.value = 'Enter a valid email'; return;
  }
  if (register.value && name.value.trim().length < 4) {
    error.value = 'Name must contain at least 4 characters'; return;
  }
  busy.value = true;
  try {
    const users = await api.findUsers(email.value.trim());
    if (users.length) emit('login', users[0]);
    else if (register.value) {
      emit('login', await api.createUser({ name: name.value.trim(), email: email.value.trim() }));
    } else register.value = true;
  } catch { error.value = 'Unable to log in or register. Please try again.'; }
  finally { busy.value = false; }
}
</script>
<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5 auth-form" novalidate @submit.prevent="submit">
      <h1 class="title is-3">{{ register ? 'You need to register' : 'Login' }}</h1>
      <fieldset :disabled="busy">
        <div class="field">
          <label class="label" for="user-email">Email</label>
          <div class="control has-icons-left">
            <input id="user-email" v-model="email" class="input" name="email" type="email" placeholder="Enter your email" autocomplete="email" @input="changeEmail">
            <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
          </div>
        </div>
        <div v-if="register" class="field">
          <label class="label" for="user-name">Your Name</label>
          <div class="control has-icons-left">
            <input id="user-name" v-model="name" class="input" name="name" placeholder="Enter your name" autocomplete="name" @input="error = ''">
            <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
          </div>
        </div>
        <p v-if="error" class="help is-danger mb-3" role="alert">{{ error }}</p>
        <button class="button is-primary" :class="{ 'is-loading': busy }" type="submit">{{ register ? 'Register' : 'Login' }}</button>
      </fieldset>
    </form>
  </section>
</template>

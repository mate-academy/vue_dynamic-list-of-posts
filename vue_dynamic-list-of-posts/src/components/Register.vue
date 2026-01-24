<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { register } from '@/api/users';

const props = defineProps({ email: { type: String, default: '' } });
const emit = defineEmits(['registered'])
const email = ref(props.email);
const errorMessage = ref('');
const name = ref('');
const isLoading = ref(false);

async function handleSubmit() {
  if (typeof name.value !== 'string' || name.value.length < 4) {
    errorMessage.value = 'Enter correct name';
    return;
  }

  isLoading.value = true;

  try {
    const user = await register({ email: email.value, name: name.value });

    if (user) {
      emit("registered", user);
    }
  } catch (e) {
    errorMessage.value = 'Network error'
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleSubmit">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input type="email" id="user-email" name="email" class="input" placeholder="Enter your email" required
            v-model="email" :disabled="isLoading" readonly="true" />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <label class="label" htmlFor="user-name"> Your Name </label>

        <div class="control has-icons-left">
          <input type="text" id="user-name" name="name" class="input" placeholder="Enter your name" required
            v-model="name" />

          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <button type="submit" :class="['button is-primary', { 'is-loading': isLoading }]"
          :disabled="isLoading">Register</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { defineEmits, ref, reactive } from 'vue';

const emailValue = ref('');
const isLoggingIn = ref(false);

const emit = defineEmits(['login', 'logout']);
const errors = reactive({
  title: '',
});

const handleSubmit = () => {
  isLoggingIn.value = true;

  setTimeout(() => {
    emit('login', { email: emailValue.value });
  }, 1000);
};
</script>
<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">Get your userId</h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            v-model="emailValue"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errors.title">error message</p>
      </div>

      <div class="field">
        <button 
          type="submit" 
          class="button is-primary"
          :class="{ 'is-loading': isLoggingIn }"
        > 
          Login
        </button>
      </div>
    </form>
  </section>
</template>
<script setup>
import { ref } from 'vue';

const email = ref('');
const emit = defineEmits(['submit']);

const handleSubmit = () => {
  emit('submit', email.value);
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">Login</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            class="input"
            placeholder="Enter your email"
            required
            v-model="email"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

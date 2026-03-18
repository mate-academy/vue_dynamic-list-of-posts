<script setup>
import { ref } from 'vue';

const props = defineProps({
  email: { type: String, required: true },
});

const emit = defineEmits(['register']);
const name = ref('');

const handleSubmit = () => {
  if (name.value.trim().length >= 4) {
    emit('register', { name: name.value, email: props.email });
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label">Email</label>
        <div class="control has-icons-left">
          <input :value="email" type="email" class="input" disabled />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <input
            v-model="name"
            type="text"
            id="user-name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Register</button>
      </div>
    </form>
  </section>
</template>
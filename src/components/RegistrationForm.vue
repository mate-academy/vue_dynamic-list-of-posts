<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialEmail: {
    type: String,
    default: '',
  },
});

const email = ref(props.initialEmail);
const name = ref('');
const emit = defineEmits(['submit']);

const handleSubmit = () => {
  emit('submit', { email: email.value, name: name.value });
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

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
        <label class="label" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4"
            v-model="name"
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

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['login']);
const email = ref('');
const name = ref('');

const BASE_URL = 'https://mate.academy/students-api';


async function handleSubmit(e) {
  e.preventDefault();
  if (!email.value) {
    alert('Please enter your email');
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/users?email=${email.value}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    const users = await res.json();
    if (users.length === 0) {
      alert('User not found');
      return;
    }
    const user = users[0];
    emit('login', user);
  } catch (err) {
    console.error(err);
    allert('Login failed. Please try again.');
  }
}
</script>

<template>
<section 
class="container is-flex is-justify-content-center"
>
  <form 
  @submit="handleSubmit" 
  class="box mt-5"
  >
    <h1 class="title is-3">You need to register</h1>

    <div class="field">
      <label 
      class="label" 
      for="user-name">Your Name</label>
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
        <span 
        class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label 
      class="label" 
      for="user-email"
      >Email</label>
      <div class="control has-icons-left">
        <input 
        v-model="email" 
        type="email" 
        id="user-email" 
        class="input" 
        placeholder="Enter your email" 
        required 
        />
        <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
      </div>
    </div>

    <div class="field">
      <button type="submit" class="button is-primary">Login</button>
    </div>
  </form>
</section>
</template>

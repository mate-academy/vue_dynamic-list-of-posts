<script setup>
import { ref } from "vue";
import { client } from "../api/post.js";

const emit = defineEmits(["login-success"]);

const email = ref("");
const name = ref("");

const isRegistrationRequired = ref(false);
const isLoading = ref(false);

const error = ref("");
const nameError = ref("");

const handleLogin = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const response = await client.get(`/users?email=${email.value.trim()}`);
    const users = response.data;

    if (users.length > 0) {
      emit("login-success", users[0]);
    } else {
      isRegistrationRequired.value = true;
    }
  } catch (err) {
    error.value = "Failed to connect to the server.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  nameError.value = "";
  isLoading.value = true;

  try {
    const response = await client.post("/users", {
      email: email.value,
      name: name.value,
    });

    emit("login-success", response.data);
  } catch (err) {
    nameError.value = "Registration failed. Try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form
      v-if="!isRegistrationRequired"
      @submit.prevent="handleLogin"
      class="box mt-5">
      <h1 class="title is-3">Log in to your account</h1>
      <div v-if="error" class="notification is-danger">
        {{ error }}
      </div>
      <div class="field">
        <label class="label"> Email </label>
        <div class="control has-icons-left">
          <input
            v-model="email"
            type="email"
            class="input"
            placeholder="Enter your email"
            required />
          <span class="icon is-small is-left"
            ><i class="fas fa-envelope"></i
          ></span>
        </div>
      </div>
      <button
        type="submit"
        class="button is-primary"
        :class="{ 'is-loading': isLoading }">
        Login
      </button>
    </form>

    <form v-else @submit.prevent="handleRegister" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>
      <div v-if="nameError" class="notification is-danger">
        {{ nameError }}
      </div>
      <div class="field">
        <label class="label">Email</label>
        <input :value="email" type="email" class="input" disabled />
      </div>
      <div class="field">
        <label class="label">Your Name</label>
        <div class="control has-icons-left">
          <input
            v-model="name"
            type="text"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4" />
          <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
        </div>
      </div>
      <button
        type="submit"
        class="button is-primary"
        :class="{ 'is-loading': isLoading }">
        Register
      </button>
    </form>
  </section>
</template>

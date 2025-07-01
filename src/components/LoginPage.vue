<script setup>
import { ref } from "vue";
import { getUserByEmail, createUser } from "@/api/users";

// оголошуємо подію
const emit = defineEmits(["login-success"]);

const email = ref("");
const name = ref("");
const isRegistered = ref(true);
const error = ref("");

const handleSubmit = async () => {
  try {
    error.value = "";

    if (isRegistered.value) {
      const response = await getUserByEmail(email.value);
      const users = response.data;

      if (users.length > 0) {
        const userData = users[0];
        localStorage.setItem("user", JSON.stringify(userData));
        emit("login-success");
      } else {
        isRegistered.value = false;
      }
    } else {
      const response = await createUser({
        email: email.value,
        name: name.value,
      });

      if (response && response.data?.id) {
        localStorage.setItem("user", JSON.stringify(response.data));
        emit("login-success");
      } else {
        error.value = "Failed to create user. Please try again.";
      }
    }
  } catch (err) {
    error.value = "Server error. Please try again later.";
    console.error("API Error:", err);

    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">
        {{ isRegistered ? "Login" : "Register" }}
      </h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            class="input"
            v-model="email"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p class="help is-danger">{{ error }}</p>
      </div>

      <div class="field" v-if="!isRegistered">
        <label class="label" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            class="input"
            v-model="name"
            required
            minlength="4"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
        <p class="help is-danger">{{ error }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isRegistered ? "Login" : "Register" }}
        </button>
      </div>
    </form>
  </section>
</template>

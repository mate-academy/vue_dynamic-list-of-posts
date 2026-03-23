<script setup>
import { ref } from "vue";
import useUserStore from "@/stores/userStore";
import { createUser, getUserByEmail } from "@/api/users";
import Register from "./needToRegister.vue";

const userStore = useUserStore();
const email = ref("");
const name = ref("");
const showRegister = ref(false);
const errorMessage = ref("");
const buttonText = ref("Login");
const titleText = ref("Get your userId");

const handleSubmit = async () => {
  errorMessage.value = "";

  if (showRegister.value) {
    try {
      const newUser = {
        name: name.value,
        email: email.value,
        username: null,
        phone: null,
      };

      const response = await createUser(newUser);

      userStore.login(response.data);
    } catch (error) {
      errorMessage.value = "Registration failed";
    }

    return;
  }

  try {
    const response = await getUserByEmail(email.value);

    if (response.data.length > 0) {
      const user = response.data[0];

      userStore.login(user);
    } else {
      showRegister.value = true;
      buttonText.value = "Register";
      titleText.value = "You need to register";
    }
  } catch (error) {
    errorMessage.value = "Login failed";
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">{{ titleText }}</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            :disabled="showRegister"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <Register v-if="showRegister" v-model="name" />

        <p class="help is-danger">
          {{ errorMessage }}
        </p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ buttonText }}
        </button>
      </div>
    </form>
  </section>
</template>

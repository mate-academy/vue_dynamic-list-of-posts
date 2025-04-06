<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "handleLogin", email: String): void;
  (e: "handleRegister", email: String, name: String): void;
}>();

const email = ref("");
const name = ref("");

const handleSubmit = () => {
  console.log(name.value);
  if (name.value.length <= 0) {
    emit("handleLogin", email.value);
  } else {
    emit("handleRegister", email.value, name.value);
  }
};

defineProps<{
  loginError: boolean;
  registerForm: boolean;
}>();
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">
        {{ registerForm ? "You need to register" : "Get your userId" }}
      </h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="email"
            required
            :disabled="registerForm"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <label class="label" for="user-name" v-if="registerForm">Name</label>

        <div class="control has-icons-left" v-if="registerForm">
          <input
            type="text"
            id="user-name"
            name="name"
            class="input"
            placeholder="Enter your name"
            minlength="{4}"
            v-model="name"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <p v-if="loginError" class="help is-danger">error message</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ registerForm ? "Register" : "Login" }}
        </button>
      </div>
    </form>
  </section>
</template>

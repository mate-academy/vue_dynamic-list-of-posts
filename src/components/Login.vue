<script setup>
import { ref, watch } from "vue";
import Loader from "./Loader.vue";
import InputField from "./InputField.vue";
import * as userApi from "../api/users.js";
import { isValidEmail } from "@/utils/validators.js";

const emit = defineEmits(["setUser"]);
const isLoading = ref(false);
const hasUser = ref("");
const userError = ref("");
const userEmail = ref("");
const emailError = ref("");

watch(userEmail, () => {
  emailError.value = "";
  userError.value = "";
  hasUser.value = "";
});

const validate = () => {
  emailError.value = "";
  
  if (!userEmail.value.trim()) {
    emailError.value = "Email is required";
    return false;
  }

  if (!isValidEmail(userEmail.value)) {
    emailError.value = "Please enter a valid email address (e.g. name@example.com)";
    return false;
  }

  return true;
};

const logIn = async () => {
  if (!validate()) return;

  try {
    isLoading.value = true;
    userError.value = "";
    hasUser.value = "";

    const res = await userApi.getUserFromEmail(userEmail.value);

    if (res.length === 0) {
      hasUser.value = "User not found";

      return;
    }

    emit('setUser', res[0])
  } catch (error) {
    console.error("Login error:", error);
    userError.value = 'Failed to load user';
  }
  finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="logIn" class="box mt-5">
      <h1 class="title is-3">Get your userId</h1>
      
      <InputField
        v-model="userEmail"
        label="User Email"
        placeholder="Enter your email"
        icon="envelope"
        :error="emailError"
      />

      <p v-if="hasUser" class="help is-danger">
        {{ hasUser }}
      </p>

      <p v-if="userError" class="help is-danger">
        {{ userError }}
      </p>

      <div class="field mt-4">
        <Loader v-if="isLoading" />
        <button v-else type="submit" class="button is-primary">
          Login
        </button>
      </div>
    </form>
  </section>
</template>

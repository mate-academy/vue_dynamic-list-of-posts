<script setup>
import { createUser, getUserByEmail } from "@/api/user";
import { defineProps, defineEmits, ref } from "vue";

const emit = defineEmits(["login"]);

const email = ref("");
const name = ref("");

const isLoading = ref(false);
const isError = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  isError.value = false;

  try {
    let user = await getUserByEmail(email.value);

    if (!user || (Array.isArray(user) && user.length === 0)) {
      user = await createUser({ email: email.value, name: name.value });
    }

    if (Array.isArray(user)) {
      emit("login", user[0]);
    } else {
      emit("login", user);
    }
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

</script>
<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">
        {{ isError ? "You need to register" : "Get your userId" }}
      </h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-loading': isLoading }"
            v-model="email"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <!-- <p class="help is-danger">error message</p> -->
      </div>

      <div class="field" v-if="isError">
        <label class="label" for="user-name"> Your Name </label>

        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            name="name"
            v-model="name"
            class="input"
            placeholder="Enter your name"
            required
            :minlength="4"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <!-- <p class="help is-danger">error message</p> -->
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

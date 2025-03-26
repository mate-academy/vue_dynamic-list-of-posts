<script setup>
import { createUser, getExistingUser  } from "@/api/users";
import { router } from "../../routes";
import { computed, ref } from "vue";

const userEmail = ref("");
const newUserName = ref("");
const error = ref("");
const isRegistration = ref(false);

const emailValidation = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(userEmail.value);
});

const nameValidation = computed(() => {
  return newUserName.value.length >= 4;
});

const getUser = async () => {
  if (!emailValidation.value) {
    error.value = "Please, enter the valid email address";
    return;
  }

  try {
    const existingUser = await getExistingUser(userEmail.value);
    const [foundUser] = existingUser;

    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      router.push("Dashboard");
    } else {
      isRegistration.value = true;
    }
  } catch (err) {
    error.value = err.message || "Failed to fetch user";
    console.error(err);
  }
};

const createNewUser = async () => {
  if (!nameValidation.value) {
    error.value = "Name must be at least 4 charachters long";
    return;
  }

  try {
    const newUser = await createUser({
      name: newUserName.value,
      email: userEmail.value,
    });

    localStorage.setItem("user", JSON.stringify(newUser));

    isRegistration.value = false;
    error.value = "";
    router.push("Dashboard");
    return newUser;
  } catch (error) {
    error.value = error.message || "Failed to create user";
    console.error(error);
  }
};

const handleSubmit = () => {
  error.value = "";
  if (isRegistration.value) {
    createNewUser();
  } else {
    getUser();
  }
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            :disabled="isRegistration"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            v-model="userEmail"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p v-if="error" class="help is-danger">{{ error }}</p>

        <div v-if="isRegistration">
          <div class="field">
            <label class="label" htmlFor="user-name"> Your Name </label>

            <div class="control has-icons-left">
              <input
                type="text"
                id="user-name"
                name="name"
                class="input"
                placeholder="Enter your name"
                required
                minlength="{4}"
                v-model="newUserName"
              />

              <span class="icon is-small is-left">
                <i class="fas fa-user" />
              </span>
            </div>

            <p v-if="error" class="help is-danger">{{ error }}</p>
          </div>
        </div>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isRegistration ? "Register" : "Login" }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createUser, getUsersList } from "../../apiClient";
import { User } from "../../types/user";
import Email from "./Email.vue";
import Username from "./Username.vue";

const props = defineProps<{
  handleSubmitUserId: (newUserId: number) => void;
  setNewUser: (newUser: User) => void;
}>();

const usersList = ref<User[]>([]);
const email = ref<string>("");
const username = ref<string>("");
const isUserExist = ref<boolean>(true);

onMounted(async () => {
  try {
    const dataUser = await getUsersList();

    usersList.value = dataUser;
  } catch (err) {
    console.error("Error fetching users:", err);
  }
});

const onSubmitLogin = async () => {
  const foundedUser = usersList.value.find((el) => el.email === email.value);

  if (foundedUser) {
    isUserExist.value = true;
    props.handleSubmitUserId(foundedUser.id!);
    props.setNewUser(foundedUser);
    return;
  }

  if (!isUserExist.value) {
    try {
      const newUser = await createUser({ username: username.value, email: email.value });

      props.handleSubmitUserId(newUser.id!);
      props.setNewUser(newUser);
      usersList.value.push(newUser);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  } else isUserExist.value = false;
};

const updateEmail = (newEmail: string) => {
  email.value = newEmail;
};

const updateUsername = (newUsername: string) => {
  username.value = newUsername;
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="onSubmitLogin" class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <Email :email="email" @onChange="updateEmail" :disable="isUserExist" />
      <template v-if="!isUserExist">
        <Username :username="username" @onChange="updateUsername" />
      </template>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

<style></style>

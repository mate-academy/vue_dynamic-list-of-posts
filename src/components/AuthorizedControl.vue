<script setup>
import { ref } from 'vue';
import { addUser, getUsers } from '@/API/users';
import LoginForm from './LoginForm.vue';
import Message from './Message.vue';

const emit = defineEmits(['getUser']);

const needToRegister = ref(false);
const user = ref(null);
const error = ref(null);

const checkEmail = async (userEmail) => {
  try {
    const users = await getUsers();
    const findUser = users.find(({ email }) => email === userEmail);
    if (findUser) {
      user.value = findUser;
      emit('getUser', user.value);
    } else {
      needToRegister.value = true;
    }
  } catch {
    error.value = 'Unable to log in. Please try later';
  }
};

const createUser = async (userData) => {
  try {
    user.value = await addUser(userData);
    emit('getUser', user.value);
  } catch {
    error.value = 'Unable to create user. Try again later';
  }
};
</script>

<template>
  <section v-if="error" class="container is-flex is-justify-content-center">
    <Message class="is-danger box mt-5">
      <p>{{ error }}</p>
    </Message>
  </section>

  <LoginForm v-else title="Get your userId" :is-register="needToRegister" @email="checkEmail($event)"
    @create-user="createUser($event)" />
</template>

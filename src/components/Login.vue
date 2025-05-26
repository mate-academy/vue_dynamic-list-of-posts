<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfo } from '../api/user';
import { useUserStore } from '../stores/userStore';

const userEmail = ref('');
const errorMessage = ref(null);
const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  if (userStore.user) {
    router.push('/');
  }
});

async function handleSubmit() {
  try {
    const userData = await getUserInfo(userEmail.value);
    if (!userData || !userData.length) {
      errorMessage.value = 'User not found. Please register.';
      return;
    }
    userStore.setUser(userData[0]);
    router.push('/');
  } catch (error) {
    errorMessage.value = 'Error fetching user: ' + error.message;
  }
}

function goToRegister() {
  router.push('/register');
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">Get your userId</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            v-model="userEmail"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p class="help is-danger">{{ errorMessage }}</p>
      </div>

      <div class="field">
        <a class="is-size-6" @click.prevent="goToRegister">Don't have an account?</a>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUser } from '@/api/users';
import { setUser } from '@/utils/user';

const router = useRouter();

const error = ref('');
const email = ref('');

const handleSubmit = async () => {
  try {
    const [user] = await getUser(email.value);

    if (user.id) {
      setUser(user);
      router.push('/');
    }
  } catch (err) {
    console.log(err);
    error.value = 'User not found';
  }
};
</script>
<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">Get your userId</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-danger': error }"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p v-if="error" class="help is-danger">{{ error }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

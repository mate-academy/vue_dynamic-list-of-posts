<script setup>
import { computed, ref, watch } from 'vue';
import NeedToRegister from './NeedToRegister.vue';

const emit = defineEmits(['email', 'createUser']);

const props = defineProps({
  title: String,
  isRegister: Boolean,
})

const email = ref(null);
const name = ref(null);
const error = ref({});

const title = computed(() => {
  return props.isRegister ? "You need to register" : "Get your userId";
});

watch(email, () => {
  delete error.value.email;
});

watch(name, () => {
  delete error.value.name;
});

const validateField = (field, value) => {
  error.value = {};

  if (value.trim() === '') {
    error.value[field] = `${field} is required`;
  }
  if (field === 'name' && value.length < 4) {
    error.value.name = 'min length 4 characters';
  }

  if (field === 'email' && !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    error.value.email = 'invalid email address';
  }
}


const formFill = () => {
  if (!props.isRegister) {
    validateField('email', email.value);

    if (error.value.email) return;

    emit('email', email.value);

  } else {
    validateField('name', name.value);

    if (error.value.name) return;

    emit('createUser', { name: name.value, email: email.value });
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="formFill" class="box mt-5" novalidate>

      <h1 class="title is-3">{{ title }}</h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input type="email" id="user-email" name="email" class="input" v-model="email"
            placeholder="Enter your email" />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p v-if="error.email" class="help is-danger">{{ error.email }}</p>
      </div>

      <NeedToRegister v-if="isRegister" v-model="name" :error="error.name" />

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

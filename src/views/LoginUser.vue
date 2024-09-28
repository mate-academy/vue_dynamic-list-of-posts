<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'handleLogin', email: string): void
  (e: 'handleRegister', email: string, name: string): void
}>();

const email = ref('')
const name = ref('')

const handleSubmit = () => {
  if (name.value.length === 0) {
    emit('handleLogin', email.value)
  } else {
    emit('handleRegister',email.value, name.value)
  }
}

defineProps<{
  needRegister: boolean
  isError: boolean
}>();
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">Get your userId</h1>

      <div class="field">
        <label class="label" for="email">
          Email

          <div class="control has-icons-left">
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              class="input"
              placeholder="Enter your email"
              :disabled="needRegister"
              required
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>
          </div>
        </label>
      </div>

      <div class="field" v-if="needRegister">
        <label class="label">
          Name
          <div class="control has-icons-left">
            <input
              v-model="name"
              type="text"
              name="name"
              class="input"
              placeholder="Enter your name"
              minlength="{4}"
              required
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user" />
            </span>
          </div>
        </label>

        <p class="help is-danger" v-if="isError">error message</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

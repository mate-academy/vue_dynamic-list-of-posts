<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const email = ref('')
const error = ref(false)

function handleLogin() {
  if (!email.value.trim()) {
    error.value = true

    return
  }

  error.value = false

  emit('login', 1)
}
</script>

<template>
  <section class="hero is-fullheight has-background-light">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4-desktop is-5-tablet">
            <div class="box p-6">
              <h1 class="title is-2 mb-5">
                Get your userId
              </h1>

              <div class="field">
                <label class="label">
                  Email
                </label>

                <div class="control has-icons-left">
                  <input
                    v-model="email"
                    class="input"
                    type="email"
                    placeholder="Enter your email"
                    @input="error = false"
                  >

                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>

                <p
                  v-if="error"
                  class="help is-danger"
                >
                  Email is required
                </p>
              </div>

              <button
                class="button is-link mt-4"
                @click="handleLogin"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: #f5f5f5;
}

.box {
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.title {
  color: #2d3748;
}

.input {
  height: 52px;
}

.button {
  min-width: 120px;
  background-color: #479b97;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
  border: none;
  color: #f5f5f5;
  margin-top: 10px;
}
</style>

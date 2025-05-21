<template>
  <div class="login-bg">
    <form class="box login-form" @submit.prevent="handleLogin">
      <h1 class="title has-text-centered login-title">Вхід</h1>
      <div class="field">
        <div class="control has-icons-left">
          <input
            class="input"
            type="email"
            v-model="email"
            placeholder="Email"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <div class="control has-icons-left">
          <input
            class="input"
            type="password"
            v-model="password"
            placeholder="Пароль"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
      </div>
      <div v-if="error" class="notification is-danger is-light">
        {{ error }}
      </div>
      <div class="field">
        <button class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }" type="submit">
          Увійти
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    const router = useRouter()

    const handleLogin = async () => {
      error.value = ''
      loading.value = true
      // Простий фейковий логін (email: test@test.com, пароль: 123456)
      setTimeout(() => {
        if (email.value === 'test@test.com' && password.value === '123456') {
          localStorage.setItem('token', 'demo-token')
          router.push('/')
        } else {
          error.value = 'Невірний email або пароль'
        }
        loading.value = false
      }, 800)
    }

    return {
      email,
      password,
      error,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  overflow: hidden;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.login-form {
  max-width: 350px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(50, 115, 220, 0.08);
  border-radius: 10px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: visible;
  margin: 0;
  box-sizing: border-box;
}
.login-title {
  color: #23272f;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.01em;
}
.input {
  font-size: 1.05rem;
  background: #fff;
  color: #23272f;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  box-shadow: none;
}
.input:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 2px #eaf4fd;
}
</style>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #f5f6fa !important;
  overflow: hidden;
  box-sizing: border-box;
}
</style> 
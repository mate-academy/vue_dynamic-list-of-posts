<script setup>
import NeedToRegister from '@/components/NeedToRegister.vue';
import fun from '@/services/api';
import { usePostStore } from '@/store/postStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const user = ref(null);
const isShowRegister = ref(false);
const errorMessage = ref('');
const email = ref('');
const name = ref('');
const message = ref('Get your userId')

const router = useRouter();
const global = usePostStore()



async function fecthUser(emailUser) {
  global.handleIsLoading(true)
  try {
    const data = await fun.getUser(emailUser)
    console.log("Dados retornados pela API:", data);
    if (data.length === 0 || !data) {
      message.value = 'You need to register'
      isShowRegister.value = true;
      return false;
    } else {
      user.value = data
      return true;
    }
    
  } catch (e) {
    errorMessage.value = 'Não foi possivel carregar os usuarios'
    console.error(e);
  } finally {
    setTimeout(() => {
      global.handleIsLoading(false)
    }, 1000)
  }
}

const registerUser = async (userData) => {
  try {
    await fun.postUser(userData);
    isShowRegister.value = false;
  } catch (e) {
    console.log(`Erro interno: ${e.message}`)
    errorMessage.value = "Erro ao registrar"
  }

}

const handleSubmit = async () => {
  errorMessage.value = '';

  if (!isShowRegister.value) {
    const found = await fecthUser(email.value)
    if (found) {
      localStorage.setItem("user", JSON.stringify(user.value[0]))
      console.log('dados salvos no local storage', localStorage.getItem("user"))

      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1000)
    }
    return;
  }
  else {
    await registerUser({ email: email.value, name: name.value });
    message.value = 'Get your userId'
  }
}

</script>

<template>
  <section class="container is-flex is-justify-content-center">
  <form @submit.prevent="handleSubmit" class="box mt-5">
    <h1 class="title is-3">{{ message }}</h1>

    <div class="field">
      <label class="label" htmlFor="user-email"> Email </label>

      <div class="control has-icons-left">
        <input
          type="email"
          id="user-email"
          name="email"
          class="input"
          placeholder="Enter your email"
          v-model="email"
          required
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
      </div>

      <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
    <NeedToRegister v-if="isShowRegister"
    v-model="name"
    :err="errorMessage"
    />
    <div class="field">
      <button type="submit" class="button is-primary" :class="{'is-loading': global.state.isLoading}">{{ isShowRegister ? "Register" : "Login" }}</button>
    </div>
  </form>
</section>
</template>
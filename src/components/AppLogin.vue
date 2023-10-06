<script>
import { getUser } from '../../api/user.js';
import AppLoader from './AppLoader.vue';
import NeedRegister from './NeedRegister.vue';

export default {
    name: 'AppLogin',
    data() {
      return {
        email: '',
        errorMessage: '',
        isNeedToRegister: false,
        isLoading: false,
      };
    },
    emits: ['login'],
    methods: {
      handleLogin() {
        this.isLoading = true,

        getUser(this.email)
          .then(response => {
            if (!response) {
              this.isNeedToRegister = true;
            }
            else {
              this.$emit('login', response);
              localStorage.setItem('user', JSON.stringify(response));
            }
          })
          .catch(() => this.errorMessage = 'Some error occured')
          .finally(() => this.isLoading = false);
      }
    },
    components: { NeedRegister, AppLoader }
}
</script>

<template>
  <section className="container is-flex is-justify-content-center login">
    <form 
      @submit.prevent="handleLogin" 
      className="box mt-5"
      v-if="!isLoading"
    >
      <h1 className="title is-3" v-if="!isNeedToRegister">Get your userId</h1>
      <h1 className="title is-3" v-else>You need to register</h1>

      <div className="field">
        <label className="label" htmlFor="user-email">Email</label>

        <div className="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            className="input"
            placeholder="Enter your email"
            v-model="email"
            required  
          />

          <span className="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p 
          className="help is-danger"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </p>
      </div>

      <NeedRegister v-if="isNeedToRegister"/>

      <div className="field">
        <button 
          type="submit" 
          className="button is-primary"
        >
          {{ isNeedToRegister ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>

    <AppLoader v-else />
  </section>
</template>

<style>
</style>
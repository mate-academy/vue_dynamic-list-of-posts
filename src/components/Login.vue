<script>
import { getUserByEmail, registrationUser } from '@/api/users';
import { setLocalStorage } from '@/utils/setLocalStorage';
import NeedToRegister from './NeedToRegister.vue';

export default {
  name: 'Login',
  components: {
    NeedToRegister,
  },
  emits: ['login'],
  data() {
    return {
      email: '',
      name: '',
      errMessage: '',
      isLoading: false,
      needRegistration: false,
      errMessageRegistration: '',
    };
  },
  methods: {
    submit() {
      this.errMessage = '';
      this.errMessageRegistration = '';
      if (!this.validation()) return;

      if (!this.needRegistration) {
        this.login();
      } else {
        this.registration();
      }
    },

    validation() {
      if (this.email.trim() === '') {
        this.errMessage = 'Email is required';
        return false;
      }

      if (this.needRegistration && this.name.trim() === '') {
        this.errMessageRegistration = 'Name is required';
        return false;
      }

      return true;
    },

    async login() {
      this.isLoading = true;
      try {
        const { data } = await getUserByEmail(this.email);
        if (data.length !== 0) {
          setLocalStorage('user', data[0]);
          this.$store.commit('setUserId', data[0].id);
          this.$emit('login');
        } else {
          this.needRegistration = true;
          this.errMessage = '';
          this.name = '';
          this.errMessageRegistration = '';
        }
      } catch (error) {
        console.error('Error during login:', error);
        this.errMessage = 'Ops, something went wrong';
      } finally {
        this.isLoading = false;
      }
    },

    async registration() {
      this.isLoading = true;
      try {
        const { data } = await registrationUser(this.email, this.name);
        setLocalStorage('user', data);
        this.$store.commit('setUserId', data.id);
        this.$emit('login');
      } catch (error) {
        console.error('Error during registration:', error);
        this.errMessageRegistration = 'Ops, something went wrong';
      } finally {
        this.isLoading = false;
      }
    },
    onEmailInput() {
      this.errMessage = '';
      this.needRegistration = false;
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="submit">
      <h1 class="title is-3">
        {{
          needRegistration ? 'You need to register' : 'Login to your account'
        }}
      </h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            id="user-email"
            v-model.trim="email"
            :class="{ 'is-danger': errMessage }"
            :disabled="isLoading"
            type="email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            @input="onEmailInput"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p v-if="errMessage" class="help is-danger">
          {{ errMessage }}
        </p>
      </div>

      <NeedToRegister
        v-if="needRegistration"
        v-model.trim="name"
        :err-message="errMessageRegistration"
        @on-input="errMessageRegistration = ''"
      />

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
        >
          {{ needRegistration ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import { addUser, getUser } from '../api/users';
import ErrorMessage from './ErrorMessage.vue';
import Loader from './Loader.vue';

export default {
  name: 'login',
  components: {
    Loader,
    ErrorMessage,
  },
  data() {
    return {
      register: false,
      email: '',
      name: '',
      loading: false,
      errorMessage: false,
    }
  },
  props: {
    user: {},
  },
  emits: ['addUser'],
  methods: {
    handleLogin() {
      this.loading = true;
      getUser(this.email)
        .then(({ data }) => {
          if (!data.length) {

            this.register = true;
          } else {
            this.$emit('addUser', data);
            this.register = false;
          }
        }
        )
        .catch(() => this.errorMessage = true)
        .finally(() => this.loading = false);
    },
    Register() {
      this.loading = true;
      const name = this.name;
      const email = this.email
      const username = null;
      const phone = null;
      addUser({ name, username, email, phone }).finally(this.handleLogin(email))
      this.register = false;
    },
  },
  emits: [],
  watch: {
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="register ? Register() : handleLogin(email)">
      <h1 className="title is-3" v-if="register">You need to register</h1>
      <h1 class="title is-3" v-else>Get your userId</h1>

      <ErrorMessage v-if="errorMessage" :props="'user'" @close="errorMessage = false"/>


      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input type="email" id="user-email" name="email" class="input" placeholder="Enter your email" required
            v-model.trim="email" :disabled="register || loading" autocomplete="off" />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <!-- <p className="help is-danger">error message</p> -->
      </div>

      <template v-if="register">
        <div className="field">
          <label className="label" htmlFor="user-name"> Your Name </label>

          <div className="control has-icons-left">
            <input type="text" id="user-name" name="name" className="input" placeholder="Enter your name" required
              minlength="{4}" v-model.trim="name" />

            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
            </span>
          </div>

          <!-- <p className="help is-danger">error message</p> -->
        </div>
      </template>

      <div class="field">
        <Loader v-if="loading" />
        <template v-else>
          <button 
            type="submit" 
            class="button is-primary"
            :class="{'is-loading': loading}"
            v-if="register"
          >
            Register
          </button>
          <button 
            type="submit" 
            class="button is-primary"
            :class="{'is-loading': loading}"
            v-else
          >
            Login
          </button>
        </template>
      </div>
    </form>
  </section>
</template>

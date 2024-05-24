<template>
  <AppHeader v-if="isAuthorized" :user="user" @logout="handleLogout" />
  <LoginForm
    v-if="!isAuthorized && !user"
    :email="email"
    :username="name"
    :error-message="errorMessage"
    :show-register-form="showRegisterForm"
    :isLoading="isLoading"
    @update:email="updateEmail"
    @update:username="updateUsername"
    @submit="handleLogin"
  />
  <PostsList v-if="isAuthorized" :user="user" />
</template>

<script>
import { createUser, getUser } from './api/user';
import AppHeader from './components/Header.vue';
import LoginForm from './components/Login.vue';
import PostsList from './components/PostsList.vue';
export default {
  components: { AppHeader, LoginForm, PostsList },
  data() {
    return {
      isAuthorized: false,
      name: '',
      email: '',
      user: JSON.parse(localStorage.getItem('user')) || null,
      errorMessage: '',
      showRegisterForm: false,
      isLoading: false
    };
  },
  mounted() {
    if (this.user) {
      this.isAuthorized = true;
    }
  },
  methods: {
    handleLogin() {
      this.errorMessage = '';
      this.isLoading = true;
      if (this.showRegisterForm && !this.isAuthorized) {
        console.log('Attempting to create user with email:', this.email, 'and name:', this.name);

        createUser(this.email, this.name)
          .then(({ data }) => {
            this.user = data;
            this.isAuthorized = true;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.showRegisterForm = false;
            console.log('success', data);
          })
          .catch((error) => {
            this.isLoading = false;
            this.errorMessage = error;
          })
          .finally(() => (this.isLoading = false));

        return;
      }
      getUser(this.email)
        .then(({ data }) => {
          this.showRegisterForm = false;

          if (data.length) {
            this.user = data[0];
            localStorage.setItem('user', JSON.stringify(this.user));
            this.isAuthorized = true;
          } else {
            this.isAuthorized = false;
            this.showRegisterForm = true;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred while logging in';
        })
        .finally(() => (this.isLoading = false));
    },
    updateEmail(email) {
      this.email = email;
    },
    updateUsername(username) {
      this.name = username;
    },
    handleLogout() {
      this.user = null;
      this.isAuthorized = false;
      this.email = '';
      this.name = '';
      localStorage.removeItem('user');
    }
  }
};
</script>

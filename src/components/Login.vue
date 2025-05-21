<script>
import { nextTick } from 'vue';
import { addUser } from '../api/api';

export default {
  name: 'Login',
  props: {
    users: Array,
    isLoading: Boolean,
  },
  emits: ['update-user'],
  data() {
    return {
      mail: '',
      name: '',
      userNotFound: false,
    };
  },

  methods: {
    findUser(users, userMail) {
      return users.find((user) => user.email === userMail);
    },
    async handleSubmit() {
      const foundUser = this.findUser(this.users, this.mail);

      if (foundUser) {
        this.userNotFound = false;
        this.$emit('update-user', foundUser);
      } else {
        if (!this.userNotFound) {
          this.userNotFound = true;
          await nextTick();
          this.$refs.nameInput.focus();
        } else {
          if (this.name.trim().length < 4) {
            alert('Name must be at least 4 characters long');
            return;
          }

          try {
            const response = await addUser(this.mail, this.name.trim());
            const newUser = response.data;
            this.$emit('update-user', newUser);
            this.mail = '';
            this.name = '';
            this.userNotFound = false;
          } catch (error) {
            console.error('Error adding user:', error);
          }
        }
      }
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleSubmit">
      <h1 class="title is-3">
        {{ userNotFound ? 'Register 👀' : 'Log in 💓' }}
      </h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            id="user-email"
            type="email"
            name="email"
            v-model="mail"
            class="input"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <!-- <p class="help is-danger">error message</p> -->
      </div>

      <div class="field" v-if="userNotFound">
        <label class="label" for="user-name"> Name </label>

        <div class="control has-icons-left">
          <input
            ref="nameInput"
            type="text"
            id="user-name"
            name="name"
            v-model="name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <!-- <p class="help is-danger">error message</p> -->
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
        >
          {{ userNotFound ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

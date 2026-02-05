<script lang="ts">
import * as userApi from '../api/user';
import type { User } from '@/types/Users.types';
import '@fortawesome/fontawesome-free/css/all.min.css'

export default {
  name: 'App',

  data() {
    return {
      email: '',
      users: [] as User[],
      errorMessage: '' as string,
    };
  },

  async mounted() {
    try {
      this.users = await userApi.getUsers();
    } catch {
      this.errorMessage = 'Failed to load users';
    }
  },

  methods: {
    handleSubmit() {
      const user = this.users.find(
        (user) => user.email === this.email
      );

      if (!user) {
        this.$router.push({
          name: 'register',
          params: {
            email: this.email,
          },
        });

        return;
      }

      localStorage.setItem('userId', user.id.toString());

      this.$router.push({
        name: 'main-page',
        params: {
          id: user.id,
        },
      });
    },
  },
};

</script>


<template>
  <form @submit.prevent="handleSubmit" class="box mt-5">
    <h1 class="title is-3">Get your userId</h1>

    <div class="field">
      <label class="label" for="user-email">Email</label>

      <div class="control has-icons-left">
        <input type="email" id="user-email" name="email" class="input" placeholder="Enter your email" v-model="email"
          required />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>

      <template v-if="errorMessage.length !== 0">
        <p class="help is-danger">{{ errorMessage }}</p>
      </template>
    </div>

    <div class="field">
      <button type="submit" class="button is-success is-small">Login</button>
    </div>
  </form>
</template>

<style scoped>
:global(body) {
  background-color: #f5f7fa;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
}

.title {
  margin: 0 0 24px;
  text-align: center;
  color: #3d3d3d;
  font-size: 32px;
  font-family: Arial, Helvetica, sans-serif;
}

.field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

.field:not(:last-child) {
  margin-bottom: 12px;
}

.label {
  color: #363636;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.input {
  background-color: #fff;
  padding: 10px 10px 10px 2.5em;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.input:valid {
  background-color: #e8f4f8;
}

.input:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

.control {
  position: relative;
}

.control.has-icons-left .icon.is-left {
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  pointer-events: none;
  position: absolute;
  color: #b5b5b5;
  transition: color 0.3s ease;
}

.input:focus~.icon.is-left {
  color: #000000;
}

.button {
  padding: 7px 16px;

  border-radius: 4px;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  background-color: #00d1b2;
  border-color: transparent;
  color: #fff;
  font-size: 0.875rem;

  cursor: pointer;
}
</style>

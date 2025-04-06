<script lang="ts">
import NeedToRegister from '@/components/NeedToRegister.vue';
import { LoadingStatus } from '@/enums';
import { getUsersByEmail, postUser } from '@/httpClient';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    NeedToRegister,
  },
  data(): {
    registration: boolean,
    loadingStatus: LoadingStatus,
    email: string,
    name: string,
  } {
    return {
      registration: false,
      loadingStatus: LoadingStatus.Success,
      email: '',
      name: '',
    };
  },
  setup() {
    return { LoadingStatus };
  },
  methods: {
    async handleSubmit() {
      this.loadingStatus = LoadingStatus.Loading;

      if (!this.registration) {
        try {
          const users = await getUsersByEmail(this.email);

          if (users[0]) {
            localStorage.setItem('user', JSON.stringify(users[0]));
            this.$router.push('./');
          } else {
            this.registration = true;
          }

          this.loadingStatus = LoadingStatus.Success;
        } catch {
          this.loadingStatus = LoadingStatus.Error;
        }
      } else {
        try {
          const user = await postUser({
            name: this.name, email: this.email
          });

          localStorage.setItem('user', JSON.stringify(user));
          this.$router.push('./');
          this.loadingStatus = LoadingStatus.Success;
        } catch {
          this.loadingStatus = LoadingStatus.Error;
        }
      }
    }
  }
});
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">{{registration ? 'You need to register' : 'Get your userId'}}</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left" :class="{'is-loading': loadingStatus === LoadingStatus.Loading}">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="email"
            :disabled="registration"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p v-if="!registration && loadingStatus === LoadingStatus.Error" class="help is-danger">Something went wrong!</p>
      </div>

      <NeedToRegister v-if="registration" v-model="name" :loading-status="loadingStatus"/>

      <div class="field">
        <button type="submit" class="button is-primary" :class="{'is-loading': loadingStatus === LoadingStatus.Loading}">
          {{registration ? 'Register' : 'Login'}}
        </button>
      </div>
    </form>
  </section>
</template>

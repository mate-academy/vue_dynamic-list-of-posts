<script>
  import { createUser, getUser, getUsers } from '@/api/users';
  import LoaderSpiner from '@/components/LoaderSpiner.vue';
  import NeedToRegister from '@/components/NeedToRegister.vue';
  import { getLocalUser } from '@/helpers/getLocalUser';

  export default {
    name: 'LoginPage',
    components: {
      NeedToRegister,
      LoaderSpiner,
    },
    data() {
      return {
        email: '',
        userName: '',
        loading: false,
        preLoadingUser: false,
        errorMessage: '',
        needRegister: false,
        users: [],
        user: getLocalUser(),
      };
    },
    mounted() {
      if (this.user.id) {
        this.errorMessage = '';
        this.preLoadingUser = true;
        getUser(this.user.id)
          .then(({ data }) => {
            localStorage.setItem('user', JSON.stringify(data));
            this.$router.push({ path: "/" });
          })
          .catch(() => {
            this.errorMessage = 'Unable to load user';
          })
          .finally(() => {
            this.preLoadingUser = false;
          });
      }
    },
    methods: {
      handleSubmit() {
        this.errorMessage = '';
        this.loading = true;

        if (!this.needRegister) {
          getUsers()
            .then(({ data }) => {
              this.users = data;

              const user = this.users.find(item => item.email === this.email);

              if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: "/" });
              } else {
                this.needRegister = true;
              }
            })
            .catch(() => {
              this.errorMessage = 'Unable to read users';
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          createUser(this.userName, this.email)
            .then(({ data }) => {
              localStorage.setItem('user', JSON.stringify(data));
              this.$router.push({ path: "/" });
              this.needRegister = false;
            })
            .catch(() => {
              this.errorMessage = 'Unable to create user';
            })
            .finally(() => {
              this.loading = false;
            });
        }
      }
    },
  }
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <LoaderSpiner v-if="preLoadingUser"/>

    <form @submit.prevent="handleSubmit" class="box mt-5" v-else>
      <h1 class="title is-3">
        {{ needRegister ? 'You need to register' : 'Get your userId' }}
      </h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left" :class="{ 'is-loading': loading }">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            v-model="email"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
      </div>

      <NeedToRegister 
        v-model="userName" 
        :loading="loading"
        v-if="!errorMessage && needRegister"
      />

      <div class="field">
        <button 
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': loading }"
          :disabled="!email"
        >
          {{ needRegister ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>
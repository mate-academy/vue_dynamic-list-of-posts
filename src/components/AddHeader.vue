<script>
import { getLocalStorage } from '@/utils/getLocalStorage';

export default {
  name: 'AddHeader',
  emits: ['logout'],
  data() {
    return {
      userName: '',
    };
  },
  mounted() {
    const user = getLocalStorage('user');
    this.userName = user?.name || '';
  },
  methods: {
    logout() {
      window.localStorage.removeItem('user');
      this.$store.commit('setUserId', null);
      this.$store.commit('addPostList', []);
      this.$emit('logout');
      this.$router.push('/login');
    },
  },
};
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p v-if="userName"><strong>User:</strong> {{ userName }}</p>
          </div>

          <button class="button is-light" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

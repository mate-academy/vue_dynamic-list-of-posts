<script lang="ts">
import HeaderComponent from '../components/Header.vue';
import PostsComponent from '../components/Posts.vue';
import { getUserById } from '../api/user';
import type { User } from '../types/Users.types';

export default {
  name: 'MainPage',

  data() {
    return {
      userId: localStorage.getItem('userId'),
      user: {} as User,
      errorMessage: '',
    };
  },

  components: {
    HeaderComponent,
    PostsComponent,
  },

  async mounted() {
    if (!this.userId) {
      return;
    }

    try {
      this.user = await getUserById(+this.userId);

    } catch {
      this.errorMessage = 'Failed to load user';
    }
  },
};
</script>

<template>
  <HeaderComponent :userName="user.name" />
  <PostsComponent :userId="userId" />
</template>


<style scoped></style>

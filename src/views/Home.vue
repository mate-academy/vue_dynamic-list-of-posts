<script setup>
import fun from '@/services/api.js';
import Header from '../components/Header.vue';
import PostList from '../components/PostList.vue';
import { ref, onMounted } from 'vue';
import { usePostStore } from '@/store/postStore.js';

const user = ref(null);
const global = usePostStore();

const localUser = () => {
  const isUser = !!localStorage.getItem("user");
  const userData = localStorage.getItem("user");
  console.log('isUser', isUser)
  console.log('userData', userData)
  if (isUser) {
    user.value = JSON.parse(userData);
  }
}


onMounted(async () => {
  localUser()
  await global.posts(user);
})


</script>

<template>
  <Header v-model="user"/>
  <main class="section">
    <PostList />
  </main>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import PostList from '../components/PostList.vue';
import { getUser } from '@/utils/user';

const router = useRouter();

const user = ref(null);

onBeforeMount(() => {
  try {
    user.value = getUser();
  } catch (err) {}

  if (!user.value) {
    router.push('/login');
  }
});
</script>

<template>
  <template v-if="user">
    <Header />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor"><PostList /></div>
      </div>
    </main>
  </template>
</template>

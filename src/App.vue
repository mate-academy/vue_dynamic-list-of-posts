<script setup>
import { onMounted, ref } from 'vue';
import Header from './components/Header.vue';
import PostBlock from './components/PostBlock.vue';
import AuthorizedControl from './components/AuthorizedControl.vue';


const user = ref(null);

onMounted(() => {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  if (savedUser) {
    user.value = savedUser;
  }
})

const handleLogOut = () => {
  user.value = null;
  localStorage.removeItem('user');
}

const getUser = (currentUser) => {
  user.value = currentUser;
  localStorage.setItem('user', JSON.stringify(currentUser));
}
</script>

<template>
  <AuthorizedControl v-if="!user" @get-user="getUser" />

  <div v-else class="section flex">
    <Header @log-out="handleLogOut" :user-name="user.name" />
    <PostBlock :user-id="user.id" />
  </div>

</template>
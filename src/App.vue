<script setup>
import AuthenticatedContent from './components/AuthenticatedContent.vue'
import AuthUser from './components/AuthUser.vue'
import { ref } from 'vue'
import { getUser } from './utils/UserLocaleStorage'

const user = ref(getUser());

console.log(user.value)
</script>

<template>
  <AuthUser v-if="!user.value" v-model:user="user" />
  <AuthenticatedContent v-else v-model:user="user" />
</template>
<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

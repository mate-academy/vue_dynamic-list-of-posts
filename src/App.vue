<script setup>
  import { ref } from 'vue';
  import AuthenticatedApp from './components/AuthenticatedApp.vue';
  import AuthenticationForm from './components/AuthenticationForm.vue';
  import { getUser } from './utils/userLocalStorageManagement';

  const user = ref(getUser());
</script>

<template>
  <AuthenticationForm v-if="!user" v-model:user="user" />

  <AuthenticatedApp v-else v-model:user="user" />
</template>

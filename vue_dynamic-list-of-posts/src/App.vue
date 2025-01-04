<script setup>
import { provide, ref } from "vue";

const existingUser = ref(JSON.parse(localStorage.getItem("user")));
provide("existingUser", existingUser);
</script>

<template>
  <router-view></router-view>
</template>

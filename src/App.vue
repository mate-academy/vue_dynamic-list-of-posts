<script setup>
import Authorization from '@/components/Authorization.vue'
import Content from '@/components/Content.vue'
import { ref } from 'vue'
import { getUser } from '@/utils/LocalStorage'

const user = ref(getUser())
</script>

<template>
  <Authorization v-if="!user" v-model:user="user"></Authorization>
  <Content v-else v-model:user="user"></Content>
</template>

<style></style>

<script setup>
import { usePostStore } from '@/store/postStore';

const global = usePostStore();


</script>
<template>
  <button type="button" @click="global.handleShowFormComment(true)" class="button is-link">Write a comment</button>
  
</template>
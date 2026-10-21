<script setup>
import { usePostStore } from '@/store/postStore';
import { computed } from 'vue';

const global = usePostStore();

const commentList = computed(() => global.state.commentList || []);
</script>

<template>
  <article class="message is-small" v-for="comment in commentList" :key="comment.id">
    <div class="message-header">
      <!-- Corrigido para a sintaxe do Vue: :href e comment.email -->
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
      
      <button 
        type="button" 
        class="delete is-small" 
        aria-label="delete"
        @click="global.fetchDeleteComment(comment.id)"
      ></button>
    </div>
    
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
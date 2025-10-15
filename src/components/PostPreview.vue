<template>
  <div class="post-preview">
    <div class="box">
      <h2 class="title is-4">{{ post.title }}</h2>
      <p class="subtitle is-6">{{ post.body }}</p>

      <div class="buttons mt-4">
        <button class="button is-warning" @click="$emit('edit', post)">Edit</button>
        <button class="button is-danger" @click="$emit('delete', post.id)">Delete</button>
      </div>
    </div>
    <CommentsList :postId="post.id" />
  </div>
</template>

<script>
import CommentsList from './CommentsList.vue'; // Importar o componente

export default {
  name: 'PostPreview',
  components: { CommentsList }, // Registrar o componente
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.post-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.box {
  padding: 1.5rem;
  flex-shrink: 0;
}
</style>
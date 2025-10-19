<template>
  <div data-cy="PostsList">
    <div class="level">
      <p class="title level-left">Posts:</p>
      <button
        class="button is-primary level-right"
        data-cy="CreatePostButton"
        @click="$emit('createPost')"
      >
        Create new post
      </button>
    </div>

    <div v-for="post in posts" :key="post.id" class="box">
      <p>{{ post.title }}</p>
      <button
        class="button is-light is-link"
        :class="{ 'is-selected': selectedPostId === post.id }"
        @click="$emit('postSelect', selectedPostId === post.id ? null : post.id)"
      >
        Select
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  posts: Array,
  selectedPostId: [Number, String, null],
});

defineEmits(['postSelect', 'createPost']);
</script>

<style scoped>
.level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.box {
  margin-bottom: 0.5rem;
}
</style>

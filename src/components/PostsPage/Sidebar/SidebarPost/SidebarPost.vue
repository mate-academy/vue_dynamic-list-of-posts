<script setup lang="ts">
import { Post } from "../../../../types/post";
import Block from "./Block.vue";

defineProps<{
  chosenPost: Post | null;
  deleteChosenPost: (postId: number) => Promise<void>;
  editPost: () => void
}>();
</script>

<template>
  <Block>
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ chosenPost?.id }}: {{ chosenPost?.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="editPost()">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          @click="deleteChosenPost(chosenPost?.id!)"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ chosenPost?.body }}</p>
  </Block>
</template>

<style>
.fa-pen-to-square::before {
  content: "🖋";
}

.fa-trash::before {
  content: "🚷";
}
</style>

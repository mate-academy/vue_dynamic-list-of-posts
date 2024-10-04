<script setup lang="ts">
import { ref, watch } from "vue";
import { Post } from "../../../types/post";

const prs = defineProps<{
  post: Post;
  chosenPost: Post | null;
  changeChosenPost: (postId: number) => void;
  closeCurrentPost: () => void;
}>();

const localChosenPost = ref(prs.chosenPost);

watch(
  () => prs.chosenPost,
  (newPost) => {
    localChosenPost.value = newPost;
  }
);
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        class="button is-link"
        @click="closeCurrentPost()"
        v-if="prs.chosenPost?.id === prs.post.id"
      >
        Close
      </button>
      <button type="button" class="button is-link is-light" @click="changeChosenPost(post.id!)" v-else>Open</button>
    </td>
  </tr>
</template>

<style scoped></style>

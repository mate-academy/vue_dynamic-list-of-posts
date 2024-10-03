<script setup lang="ts">
import { ref, watch } from "vue";
import Block from "./Block.vue";
import { Comment } from "../../../../types/comment";
import CommentInfo from "./CommentInfo.vue";

const props = defineProps<{
  postComments: Comment[] | null;
}>();

const localPostComments = ref<Comment[]>(props.postComments!);

watch(
  () => props.postComments,
  (newPostComments) => {
    localPostComments.value = newPostComments!;
  }
);
</script>

<template>
  <Block>
    <template v-if="postComments?.length === 0">
      <p class="title is-4">No comments yet</p>
      <button type="button" class="button is-link">Write a comment</button>
    </template>
    <template v-else>
      <CommentInfo v-for="comment of localPostComments" :key="comment.id" :comment="comment!" />
      <button type="button" class="button is-link">Write a comment</button>
    </template>
  </Block>
</template>

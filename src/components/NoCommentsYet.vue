<script setup>
import { usePostStore } from "@/store/postStore.js";
import Comment from "./Comment.vue";
import WriteCommentBtn from "./WriteCommentBtn.vue";
import { watch } from "vue";
import PostLoader from "./PostLoader.vue";

const global = usePostStore();

watch(() => global.state.activePostId,
    async (newPostId) => {
      if (newPostId) {
        await global.fetchComment(newPostId);
      }
    },
    { immediate: true }
);
</script>
<template>
  <div class="block">
    <p v-if="(global.state.commentList?.length === 0 && !global.state.isLoadingComment) || global.state.commentsError" class="title is-4" :class="{'has-text-danger': !!global.state.commentsError}"">
      {{!global.state.commentsError ? 'No comments yet' : global.state.commentsError}}
    </p>
    <PostLoader v-if="global.state.isLoadingComment" />
    <Comment
      v-if="
        (global.state.commentList?.length !== 0 && !global.state.isLoadingComment) && !global.state.isComment
      "
    />
    <WriteCommentBtn v-if="
        !global.state.isLoadingComment && !global.state.isComment
      "/>
  </div>
</template>

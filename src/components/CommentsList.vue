<script setup>
import { useCommentsStore } from "@/stores/comments";
import { usePostStore } from "@/stores/posts";
import { onMounted, watch } from "vue";

const commentStore = useCommentsStore();
const postStore = usePostStore();

const gettingComments = async () => {
  if (postStore.currentPost?.id) {
    await commentStore.fetchComments(postStore.currentPost.id);
  }
};

onMounted(gettingComments);
watch(
  () => postStore.currentPost?.id,
  (newPostId) => {
    if (newPostId) {
      gettingComments();
    }
  }
);

const handleDeleteComment = async (commentId) => {
  await commentStore.removeComment(commentId);
};

const handleOpeningForm = () => {
  commentStore.showCommentForm();
  postStore.notShowDetailsPost();
};
</script>

<template>
  <div
    v-if="commentStore.isLoadingComments"
    className="is-flex is-justify-content-center is-align-items-center mt-2"
  >
    <LoaderField />
  </div>
  <article
    v-else
    className="message is-small"
    v-for="comment in commentStore.comments"
    :key="comment.id"
  >
    <div className="message-header">
      <a :href="'mailto:' + comment.email">{{ comment.name }}</a>
      <button
        type="button"
        className="delete is-small"
        aria-label="delete"
        @click="handleDeleteComment(comment.id)"
      >
        delete button
      </button>
    </div>
    <div className="message-body">{{ comment.body }}</div>
  </article>
  <button type="button" class="button is-link" @click="handleOpeningForm">
    Write a comment
  </button>
</template>

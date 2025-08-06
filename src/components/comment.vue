<script setup>
import { deleteComment } from "@/api/comments";
import { useCommentsStore } from "@/stores/commentsStore";
import { usePostsStore } from "@/stores/postsStore";

const commentsStore = useCommentsStore();
const postsStore = usePostsStore();

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  postId: Number,
});

const handleDelete = async () => {
  commentsStore.removeComment(comment.id);

  try {
    await deleteComment(comment.id);
  } catch (error) {
    console.error("Failed to delete comment, reverting:", error);
    commentsStore.addComment(comment, postsStore.activePostId);
  }
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
      <button
        @click="handleDelete"
        type="button"
        class="delete is-small"
        aria-label="delete"
        
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

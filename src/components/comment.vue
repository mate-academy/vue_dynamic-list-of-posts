<script setup>
import { deleteComment } from "@/api/comments";
import useCommentsStore from "@/stores/commentsStore";
import usePostsStore from "@/stores/postsStore";
import { ref } from "vue";

const commentsStore = useCommentsStore();
const postStore = usePostsStore();

const error = ref("");

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  postId: Number,
});

const handleDelete = async () => {
  commentsStore.removeComment(props.comment.id, postStore.activePostId);

  try {
    await deleteComment(props.comment.id);
  } catch (error) {
    error.value = `Failed to delete comment, reverting: ${error}`;

    commentsStore.addComment(props.comment, props.postId);
  }
};

const handleDeleteError = () => {
  error.value = "";
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="handleDelete"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>

  <article v-if="error" class="message is-danger" style="margin-top: 10px">
    <div class="message-header">
      <p>Error Message</p>
      <button
        @click="handleDeleteError"
        class="delete"
        aria-label="delete"
      ></button>
    </div>
    <div class="message-body">
      {{ error }}
    </div>
  </article>
</template>

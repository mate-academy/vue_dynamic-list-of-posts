<script setup>
import { createComment, deleteComment, getPostComments } from "@/api/comments";
import { ref, watch } from "vue";
import Comment from "./Comment.vue";
import NoCommentsMessage from "./NoCommentsMessage.vue";
import WriteCommentBtn from "./WriteCommentBtn.vue";
import PostLoader from "./PostLoader.vue";
import CommentForm from "./CommentForm.vue";

const props = defineProps({
  post: Object,
});
const isCommentCreating = ref(false);
const isLoading = ref(false);
const isError = ref("");

const startCreatingComment = () => {
  isCommentCreating.value = true;
  console.log("comment creating", isCommentCreating.value);
};

const comments = ref([]);

const getComments = async () => {
  try {
    isLoading.value = true;
    comments.value = await getPostComments(props.post.id);
  } catch (error) {
    console.error("Error fetching comments", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteCommentHandler = async (commentId) => {
  comments.value = comments.value.filter((comment) => comment.id !== commentId);
  try {
    await deleteComment(commentId);
  } catch (error) {
    console.error("Failed deleting comments", error);
    isError.value = "Failed deleting comments";
  }
};

const creatingCommentClose = () => {
  isCommentCreating.value = false;
};

const createNewComment = async (data) => {
  if (!data) {
    return;
  }

  try {
    const payload = {
      postId: props.post?.id,
      ...data,
    };

    comments.value.push(payload);
    const newComment = await createComment(payload);
    isCommentCreating.value = false;
    return newComment;
  } catch (error) {
    console.error("Failed to create new comment", error);
  }
};

watch(
  () => props.post.id,
  async () => {
    await getComments();
  }
);
</script>

<template>
  <PostLoader v-if="isLoading" />
  <NoCommentsMessage v-else-if="!isLoading && !comments.length" />
  <Comment
    v-else-if="!isCommentCreating && !isLoading && comments.length"
    :comments="comments"
    :deleteCommentHandler="deleteCommentHandler"
  />

  <WriteCommentBtn
    v-if="!isCommentCreating"
    :is-comment-creating="isCommentCreating"
    @startCreating="startCreatingComment"
  />

  <CommentForm
    v-else
    @cancel="creatingCommentClose"
    :is-comment-creating="isCommentCreating"
    @create="createNewComment($event)"
  />
</template>

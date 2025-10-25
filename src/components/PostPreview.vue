<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Post } from "../types/Post";
import type { Comment } from "../types/Comment";
import NoComments from "./NoComments.vue";
import SingleComment from "./SingleComment.vue";
import PostLoader from "./PostLoader.vue";
import AddComment from "./AddComment.vue";
import { CommentsAPI } from "../api/client";

const comments = ref<Comment[]>([]);
const props = defineProps<{
  post: Post;
  deleting: number | null;
}>();
const error = ref<string | null>(null);
const addCommentOpen = ref(false);
const commentLoading = ref(false);
const commentDeleting = ref<number | null>(null);

const emit = defineEmits<{
  edit: [post: Post];
  delete: [post: Post];
}>();

const handleCommentAdded = (newComment: Comment) => {
  comments.value.push(newComment);
};

const toggleAddComment = () => {
  addCommentOpen.value = !addCommentOpen.value;
};

async function loadComments(postId: number) {
  comments.value = [];
  commentLoading.value = true;
  error.value = null;
  try {
    const postComments = await CommentsAPI.getCommentsByPostId(postId);
    comments.value = postComments;
  } catch (err) {
    error.value = "Failed to load data";
  } finally {
    commentLoading.value = false;
  }
}

onMounted(async () => {
  loadComments(props.post.id);
});

const handleDelete = async (comment: Comment) => {
  const commentIndex = comments.value.findIndex((c) => c.id === comment.id);
  if (commentIndex === -1) return; // Safety check
  
  const removedComment = comments.value[commentIndex]!;
  comments.value = comments.value.filter((c) => c.id !== comment.id);
  
  commentDeleting.value = comment.id;
  try {
    await CommentsAPI.deleteComment(comment.id);
  } catch {
    // Restore the comment if deletion failed
    comments.value.splice(commentIndex, 0, removedComment);
    error.value = "Failed to delete comment";
  } finally {
    commentDeleting.value = null;
  }
};

watch(
  () => props.post.id,
  (newPostId) => {
    loadComments(newPostId);
  }
);
</script>

<template>
  <PostLoader v-if="deleting && deleting === props.post.id"></PostLoader>
  <div v-else class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2 class="title">#{{ props.post.id }}: {{ props.post.title }}</h2>
      <div class="is-flex">
        <span
          class="icon is-small is-right is-clickable"
          @click="$emit('edit', props.post)"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="$emit('delete', props.post)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <div class="block">
      <p data-cy="PostBody">{{ props.post.body }}</p>
    </div>

    <AddComment
      v-if="addCommentOpen"
      :postId="props.post.id"
      @close="toggleAddComment"
      @commentAdded="handleCommentAdded"
    ></AddComment>
    <PostLoader v-else-if="commentLoading"></PostLoader>
    <NoComments v-else-if="comments.length === 0"></NoComments>
    <div v-else-if="error" class="notification is-danger">
      {{ error }}
    </div>
    <div class="block" v-else v-for="c in comments">
      <SingleComment
        :comment="c"
        :key="c.id"
        @delete="handleDelete"
        :deleting="commentDeleting"
      ></SingleComment>
    </div>
    <button
      v-if="!addCommentOpen && !commentLoading"
      type="button"
      class="button is-primary"
      @click="toggleAddComment"
    >
      Write a comment
    </button>
  </div>
</template>

<template>
  <div class="tile is-child box is-success">
    <div v-if="isCreating || isEditing">
      <PostForm
        :post="post"
        @save="savePost"
        @cancel="cancel"
      />
    </div>
    <div v-else>
      <PostPreview
        :post="post"
        @edit="editPost"
        @delete="deletePost"
      />
      <div class="block">
        <Loader v-if="loadingComments" />
        <p v-else-if="commentsError" class="notification is-danger">Failed to load comments</p>
        <p v-else-if="!comments.length" class="title is-4">No comments yet</p>
        <Comment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @delete="handleDeleteComment"
        />
      </div>
      <button
        v-if="!showCommentForm"
        class="button is-link"
        @click="showCommentForm = true"
      >
        Write a comment
      </button>
      <CommentForm
        v-if="showCommentForm"
        @submit="addComment"
        @cancel="showCommentForm = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';
import Comment from './Comment.vue';
import CommentForm from './CommentForm.vue';
import Loader from './Loader.vue';
import { useComments } from '../composables/useComments';

const props = defineProps(['post', 'isEditing', 'isCreating']);
const emit = defineEmits(['close', 'save-post', 'delete-post', 'edit-post', 'add-comment', 'delete-comment']);

const { comments, loadingComments, commentsError, fetchComments, createComment, deleteComment } = useComments();
const showCommentForm = ref(false);

watch(
  () => [props.post?.id, props.isCreating, props.isEditing],
  async ([newPostId]) => {
    if (newPostId && !props.isCreating && !props.isEditing) {
      await fetchComments(newPostId);
      showCommentForm.value = false;
    }
  },
  { immediate: true }
);

const savePost = (postData) => {
  emit('save-post', postData);
};

const cancel = () => {
  emit('close');
};

const editPost = () => {
  emit('edit-post');
};

const deletePost = () => {
  emit('delete-post', props.post.id);
};

const addComment = async (commentData) => {
  try {
    const newComment = await createComment(props.post.id, commentData);
    comments.value.push(newComment);
    showCommentForm.value = false;
  } catch (error) {
    alert('Failed to add comment. Please try again.');
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    comments.value = comments.value.filter((c) => c.id !== commentId);
    await deleteComment(props.post.id, commentId);
  } catch (error) {
    alert('Failed to delete comment. Please try again.');
    await fetchComments(props.post.id); // Revert on error
  }
};
</script>
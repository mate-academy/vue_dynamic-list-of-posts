<script setup>
import { ref, reactive, defineEmits, defineProps, watch } from 'vue';
import { createComment, getComments, deleteComment } from '../api/comment';
import Loader from './Loader.vue';

const props = defineProps({
  postId: Number,
});

const emit = defineEmits(['create-comment', 'close-form']);
const isWrittingComment = ref(false);
const isSubmitting = ref(false);
const comments = ref([]);
const isCommentsLoading = ref(false);
const commentsError = ref(false);
const commentsSubmitError = ref(false);
const commentData = reactive({
  name: '',
  email: '',
  body: '',
});

const errors = reactive({
  name: '',
  body: '',
  email: '',
});

watch(() => commentData.name, (newValue) => {
  if (newValue.trim()) {
    errors.name = false;
  }
});

watch(() => commentData.body, (newValue) => {
  if (newValue.trim()) {
    errors.body = false;
  }
});

watch(() => commentData.email, (newValue) => {
  if (newValue.trim() && newValue.includes('@')) {
    errors.email = false;
  }
});

watch(
  () => props.postId,
  async (newPostId) => {
    if (!newPostId) {
      return;
    }
    try {
      isCommentsLoading.value = true;
      commentsError.value = false;
      comments.value = [];
      const allComments = await getComments(newPostId);
      comments.value = allComments;
    } catch (error) {
      commentsError.value = true;
      console.error('Помилка при завантаженні коментаря:', error);
    } finally {
      isCommentsLoading.value = false;
    }
  }, { immediate: true }
);

const handleCommentSubmit = async () => {
  errors.name = !commentData.name.trim();
  errors.email = !commentData.email.trim() || !commentData.email.includes('@');
  errors.body = !commentData.body.trim();

  if (errors.name || errors.body || errors.email) {
    return;
  }
  isSubmitting.value = true;
  commentsSubmitError.value = false;

  try {
    const newComment = await createComment({
      postId: props.postId,
      ...commentData,
    });
    comments.value.push(newComment);

    commentData.body = '';
    isWrittingComment.value = false;
  } catch (error) {
    commentsSubmitError.value = true;
    console.error('Помилка при створенні коментаря:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteComment = async (commentId) => {
  const commentIndex = comments.value.findIndex(c => c.id === commentId);
  const deletedComment = comments.value[commentIndex];

  comments.value = comments.value.filter(c => c.id !== commentId);
  try {
    await deleteComment(commentId);
  } catch (error) {
    console.error('Помилка при видаленні:', error);

    if (deletedComment && commentIndex !== -1) {
      comments.value.splice(commentIndex, 0, deletedComment);
      alert('Failed to delete comment. Please try again.');
    }
  }
};

const handleCancel = () => {
  isWrittingComment.value = false;
  commentData.name = '';
  commentData.email = '';
  commentData.body = '';
  
  errors.name = '';
  errors.email = '';
  errors.body = '';
};
</script>

<template>
  <div class="block">
    <Loader v-if="isCommentsLoading" />
    <p v-if="commentsError" class="has-text-danger">Failed to load comments</p>
    <template v-if="!isCommentsLoading && !commentsError && !isWrittingComment">
      <article
        v-for="comment of comments" 
        :key="comment.id"
        class="message is-small" 
      >
        <div class="message-header">
          <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
          <button 
            type="button" 
            class="delete is-small" aria-label="delete"
            @click="handleDeleteComment(comment.id)"
          ></button>
        </div>
        <div class="message-body">{{ comment.body }}</div>
     </article>
    </template>
  </div>

  <div class="block" >
    <p 
      class="title is-4" 
      v-if="comments.length === 0 && !isCommentsLoading && !commentsError"
    >
      No comments yet
    </p>
    <button 
      v-if="!isWrittingComment"
      type="button" 
      class="button is-link"
      @click="isWrittingComment = true"
      >
        Write a comment
    </button>
  </div>

  <div class="block" v-if="isWrittingComment">
    <p v-if="commentsSubmitError" class="has-text-danger mb-3">
      Failed to add comment. Please try again!
    </p>
    <form @submit.prevent>
      <div class="field" data-cy="NameField">
        <label class="label" for="post-comment">Author Name</label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            v-model="commentData.name"
            id="post-comment"
            placeholder="Name Surname"
            class="input"
            :class="{'is-danger': errors.name}"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
          <span
            class="icon is-small is-right has-text-danger"
            data-cy="ErrorIcon"
            v-if="errors.name"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>
        <p class="help is-danger" data-cy="ErrorMessage" v-if="errors.name">Name is required</p>
      </div>

      <div class="field" data-cy="EmailField">
        <label class="label" for="post-email">Author Email</label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            v-model="commentData.email"
            id="post-email"
            placeholder="Your Email"
            class="input"
            :class="{'is-danger': errors.email}"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
          <span
            class="icon is-small is-right has-text-danger"
            data-cy="ErrorIcon"
            v-if="errors.email"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>
        <p class="help is-danger" data-cy="ErrorMessage" v-if="errors.email">Email is required</p>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="post-body">Write Post Body</label>
        <div class="control">
          <textarea
          v-model="commentData.body"
          id="post-body"
          placeholder="Comment"
          class="textarea"
          :class="{ 'is-danger': errors.body}"
          ></textarea>
        </div>
        <p class="help is-danger" data-cy="ErrorMessage" v-if="errors.body">Comment is required</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit" 
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
            @click="handleCommentSubmit"
           
          >
            {{ commentsSubmitError ? 'Retry' : 'Add Comment' }}
          </button>
        </div>
        <div class="control">
          <button 
            type="button" 
            class="button is-link is-light"
            @click="handleCancel"
          > 
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
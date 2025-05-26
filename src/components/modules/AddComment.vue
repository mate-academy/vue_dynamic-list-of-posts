<script setup>
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { usePostStore } from '../../stores/postsStore';
import { useCommentStore } from '../../stores/commentsStore';

const postStore = usePostStore();
const commentStore = useCommentStore();

const idPost = postStore.isCommentDetailsActive.id;

async function handleAddComment(postId) {
  commentStore.errorMessages.name = '';
  commentStore.errorMessages.email = '';
  commentStore.errorMessages.body = '';

  let hasError = false;

  if (!commentStore.newComment.name.trim()) {
    commentStore.errorMessages.name = 'Name is required';
    hasError = true;
  }

  if (!commentStore.newComment.email.trim()) {
    commentStore.errorMessages.email = 'Email is required';
    hasError = true;
  }

  if (!commentStore.newComment.body.trim()) {
    commentStore.errorMessages.body = 'Body is required';
    hasError = true;
  }

  if (hasError) {
    return;
  }
  try {
    await commentStore.addComment(postId);
  } catch (err) {
    commentStore.errorMessages.fetch = 'Error adding post: ' + err.message;
  }
}

function clearNameError() {
  if (commentStore.newComment.name.trim()) {
    commentStore.errorMessages.name = null;
  }
}

function clearEmailError() {
  if (commentStore.newComment.email.trim()) {
    commentStore.errorMessages.email = null;
  }
}

function clearBodyError() {
  if (commentStore.newComment.body.trim()) {
    commentStore.errorMessages.body = null;
  }
}
</script>
<template>
  <div class="content">
    <h2 v-if="idPost">Create new comment</h2>
    <h2 v-else>Comment editing</h2>

    <form @submit.prevent="handleAddComment(idPost)">
      <div class="field" data-cy="NameField">
        <InputField
          :label="`Author Name`"
          :input-id="'authorName'"
          :placeholder="'Name Surname'"
          :error-message="commentStore.errorMessages.name"
          v-model="commentStore.newComment.name"
          @input="clearNameError"
        />
      </div>
      <div class="field" data-cy="NameField">
        <InputField
          :label="`Author Email`"
          :input-id="'authorEmail'"
          :placeholder="'Your Email'"
          :type="'email'"
          :icon-left="'fas fa-envelope'"
          :error-message="commentStore.errorMessages.email"
          v-model="commentStore.newComment.email"
          @input="clearEmailError"
        />
      </div>
      <div class="field" data-cy="NameField">
        <TextAreaField
          :label="`Write comment body`"
          :input-id="'postBody'"
          :placeholder="'Your comment'"
          :error-message="commentStore.errorMessages.body"
          v-model="commentStore.newComment.body"
          @input="clearBodyError"
        />
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add comment</button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="commentStore.toggleCommentForm();"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

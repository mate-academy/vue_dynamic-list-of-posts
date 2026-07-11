<script setup>
import Loader from "./Loader.vue";
import CommentsList from "./CommentsList.vue";
import CommentForm from "./CommentForm.vue";

defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    default: () => [],
  },
  loadingComments: Boolean,
  writeComment: Boolean,
  authorName: String,
  authorEmail: String,
  authorBody: String,
  errorMessageAuthorName: String,
  errorMessageAuthorEmail: String,
  errorMessageAuthorBody: String,
  commentWriteError: String,
  errorMessageDeletePost: String,
  errorMessageEditPost: String,
  errorMessageDeleteComment: String,
  loadingAddComment: Boolean,
});

defineEmits([
  "edit-post",
  "delete-post",
  "delete-comment",
  "write-comment",
  "add-comment",
  "cancel-write-comment",
  "author-name-input",
  "author-email-input",
  "author-body-input",
]);
</script>

<template>
  <div class="tile is-child">
    <div class="content">
      <div class="block">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center"
        >
          <h2>#{{ post.id }}: {{ post.title }}</h2>
          <div class="is-flex">
            <span
              class="icon is-small is-right is-clickable"
              @click="$emit('edit-post')"
              ><i class="fas fa-pen-to-square"></i></span
            ><span
              class="icon is-small is-right has-text-danger is-clickable ml-3"
              @click="$emit('delete-post')"
              ><i class="fas fa-trash"></i
            ></span>
          </div>
        </div>
        <p data-cy="PostBody">{{ post.body }}</p>
      </div>
      <div class="block">
        <Loader v-if="loadingComments" />

        <div v-else class="block">
          <p
            v-if="comments.length === 0 && writeComment === false"
            class="title is-4"
          >
            No comments yet
          </p>

          <CommentsList
            v-if="writeComment === false"
            :comments="comments"
            @delete-comment="$emit('delete-comment', $event)"
          />

          <CommentForm
            v-if="writeComment"
            :author-name="authorName"
            :author-email="authorEmail"
            :author-body="authorBody"
            :error-message-author-name="errorMessageAuthorName"
            :error-message-author-email="errorMessageAuthorEmail"
            :error-message-author-body="errorMessageAuthorBody"
            :comment-write-error="commentWriteError"
            :error-message-delete-post="errorMessageDeletePost"
            :error-message-edit-post="errorMessageEditPost"
            :error-message-delete-comment="errorMessageDeleteComment"
            :loading-add-comment="loadingAddComment"
            @submit="$emit('add-comment')"
            @cancel="$emit('cancel-write-comment')"
            @name-input="$emit('author-name-input', $event)"
            @email-input="$emit('author-email-input', $event)"
            @body-input="$emit('author-body-input', $event)"
          />
        </div>
        <button
          data-cy="WriteCommentButton"
          type="button"
          class="button is-link"
          @click="$emit('write-comment')"
          v-if="writeComment === false"
        >
          Write a comment
        </button>
      </div>
    </div>
  </div>
</template>
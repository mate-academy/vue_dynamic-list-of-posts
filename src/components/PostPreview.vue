<script setup>
import CommentItem from './CommentItem.vue';
import Loader from './Loader.vue';
import NewCommentForm from './NewCommentForm.vue';

defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
  commentsLoading: {
    type: Boolean,
    default: false,
  },
  commentsError: {
    type: String,
    default: '',
  },
  commentFormVisible: {
    type: Boolean,
    default: false,
  },
  commentSubmitting: {
    type: Boolean,
    default: false,
  },
  commentSuccessToken: {
    type: Number,
    default: 0,
  },
  deletingCommentIds: {
    type: Array,
    default: () => [],
  },
  deletingPost: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  'edit',
  'delete-post',
  'retry-comments',
  'show-comment-form',
  'add-comment',
  'delete-comment',
]);
</script>

<template>
  <div class="content" data-cy="PostDetails">
    <div class="block">
      <div class="is-flex is-justify-content-space-between is-align-items-center gap-3">
        <h2 class="title is-4 mb-0" data-cy="PostTitle">
          #{{ post.id }}: {{ post.title }}
        </h2>

        <div class="is-flex post-actions">
          <button
            type="button"
            class="icon-button"
            aria-label="Edit post"
            data-cy="EditPostButton"
            :disabled="deletingPost"
            @click="$emit('edit')"
          >
            <span class="icon is-small"><i class="fas fa-pen-to-square"></i></span>
          </button>

          <button
            type="button"
            class="icon-button has-text-danger ml-3"
            aria-label="Delete post"
            data-cy="DeletePostButton"
            :class="{ 'is-loading': deletingPost }"
            :disabled="deletingPost"
            @click="$emit('delete-post')"
          >
            <span class="icon is-small"><i class="fas fa-trash"></i></span>
          </button>
        </div>
      </div>

      <p class="preserve-lines mt-3" data-cy="PostBody">
        {{ post.body }}
      </p>
    </div>

    <Loader v-if="commentsLoading" />

    <div v-else-if="commentsError" class="notification is-danger is-light" data-cy="CommentsError">
      <p>{{ commentsError }}</p>
      <button type="button" class="button is-danger is-light is-small mt-2" @click="$emit('retry-comments')">
        Retry
      </button>
    </div>

    <template v-else>
      <div v-if="comments.length === 0" class="block" data-cy="NoCommentsMessage">
        <p class="title is-4">
          No comments yet
        </p>
      </div>

      <div v-else class="comments-list">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :deleting="deletingCommentIds.includes(comment.id)"
          @delete="$emit('delete-comment', $event)"
        />
      </div>

      <button
        v-if="!commentFormVisible"
        type="button"
        class="button is-link"
        data-cy="WriteCommentButton"
        @click="$emit('show-comment-form')"
      >
        Write a comment
      </button>

      <NewCommentForm
        v-else
        ref="commentForm"
        :submitting="commentSubmitting"
        :success-token="commentSuccessToken"
        @submit="$emit('add-comment', $event)"
      />
    </template>
  </div>
</template>

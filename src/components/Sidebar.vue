<script setup>
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  post: {
    type: Object,
    default: null,
  },
  postSubmitting: {
    type: Boolean,
    default: false,
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
  'save-post',
  'cancel-form',
  'edit-post',
  'delete-post',
  'retry-comments',
  'show-comment-form',
  'add-comment',
  'delete-comment',
]);
</script>

<template>
  <aside
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': open }"
    data-cy="Sidebar"
    aria-live="polite"
  >
    <div class="tile is-child box sidebar-card">
      <PostForm
        v-if="mode === 'create' || mode === 'edit'"
        :post="mode === 'edit' ? post : null"
        :submitting="postSubmitting"
        @submit="$emit('save-post', $event)"
        @cancel="$emit('cancel-form')"
      />

      <PostPreview
        v-else-if="mode === 'preview' && post"
        :post="post"
        :comments="comments"
        :comments-loading="commentsLoading"
        :comments-error="commentsError"
        :comment-form-visible="commentFormVisible"
        :comment-submitting="commentSubmitting"
        :comment-success-token="commentSuccessToken"
        :deleting-comment-ids="deletingCommentIds"
        :deleting-post="deletingPost"
        @edit="$emit('edit-post')"
        @delete-post="$emit('delete-post')"
        @retry-comments="$emit('retry-comments')"
        @show-comment-form="$emit('show-comment-form')"
        @add-comment="$emit('add-comment', $event)"
        @delete-comment="$emit('delete-comment', $event)"
      />
    </div>
  </aside>
</template>

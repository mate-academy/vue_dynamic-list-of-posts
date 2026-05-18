<script setup>
import Comment from './Comment.vue'
import NewCommentForm from './NewCommentForm.vue'
import NoCommentsYet from './NoCommentsYet.vue'
import PostLoader from './PostLoader.vue'

defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  canRetryError: {
    type: Boolean,
    default: false,
  },
  isCommentFormOpen: {
    type: Boolean,
    default: false,
  },
  isDeletingPost: {
    type: Boolean,
    default: false,
  },
  deletePostError: {
    type: String,
    default: '',
  },
})

defineEmits([
  'cancel-comment',
  'create-comment',
  'delete-post',
  'delete-comment',
  'edit-post',
  'retry-comment-action',
  'write-comment',
])
</script>

<template>
  <div class="content">
    <div class="block">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <h2>#{{ post.id }}: {{ post.title }}</h2>

        <div class="is-flex">
          <span
            class="icon is-small is-right is-clickable"
            @click="!isDeletingPost && $emit('edit-post')"
          >
            <i class="fas fa-pen-to-square"></i>
          </span>

          <span
            class="icon is-small is-right has-text-danger is-clickable ml-3"
            @click="!isDeletingPost && $emit('delete-post')"
          >
            <i :class="isDeletingPost ? 'fas fa-spinner fa-spin' : 'fas fa-trash'"></i>
          </span>
        </div>
      </div>

      <p data-cy="PostBody">{{ post.body }}</p>

      <div v-if="deletePostError" class="notification is-danger is-light">
        {{ deletePostError }}
      </div>
    </div>

    <hr />

    <NewCommentForm
      v-if="!isLoading && !error && isCommentFormOpen"
      :key="post.id"
      :post-id="post.id"
      @cancel="$emit('cancel-comment')"
      @created="$emit('create-comment', $event)"
    />

    <PostLoader v-else-if="isLoading" label="Loading comments" />

    <div v-else-if="error" class="notification is-danger is-light">
      {{ error }}

      <button
        v-if="canRetryError"
        type="button"
        class="button is-danger is-light is-small ml-3"
        @click="$emit('retry-comment-action')"
      >
        Retry
      </button>
    </div>

    <NoCommentsYet v-else-if="comments.length === 0" />

    <template v-else>
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @delete="$emit('delete-comment', $event)"
      />
    </template>

    <template v-if="!isLoading && !error && !isCommentFormOpen">
      <button type="button" class="button is-link" @click="$emit('write-comment')">
        Write a comment
      </button>
    </template>
  </div>
</template>

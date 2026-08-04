<script setup>
import Loader from './Loader.vue';
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';
import CommentsList from './CommentsList.vue';
import CommentForm from './CommentForm.vue';

defineProps({
  selectedPost: {
    type: Object,
    default: null,
  },

  isEditing: {
    type: Boolean,
    required: true,
  },

  comments: {
    type: Array,
    required: true,
  },

  areCommentsLoading: {
    type: Boolean,
    required: true,
  },

  commentsError: {
    type: String,
    required: true,
  },

  isCommentFormVisible: {
    type: Boolean,
    required: true,
  },

  isCommentSubmitting: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  'close',
  'create-post',
  'update-post',
  'cancel-edit',
  'edit-post',
  'delete-post',
  'delete-comment',
  'show-comment-form',
  'create-comment',
]);
</script>

<template>
  <div class="box app-box">
    <div class="content">
      <button
        type="button"
        class="delete"
        @click="emit('close')"
      ></button>

      <PostForm
        v-if="!selectedPost"
        @submit="emit('create-post', $event)"
        @cancel="emit('close')"
      />

      <PostForm
        v-else-if="isEditing"
        :post="selectedPost"
        @submit="emit('update-post', $event)"
        @cancel="emit('cancel-edit')"
      />

      <template v-else>
        <PostPreview
          :post="selectedPost"
          @edit="emit('edit-post')"
          @delete="emit('delete-post', selectedPost.id)"
        />

        <Loader v-if="areCommentsLoading" />

        <div
          v-else-if="commentsError"
          class="notification is-danger"
        >
          {{ commentsError }}
        </div>

        <div
          v-else-if="comments.length === 0"
          class="block"
        >
          <p class="title is-4">
            No comments yet
          </p>
        </div>

        <CommentsList
          v-else
          :comments="comments"
          @delete="emit('delete-comment', $event)"
        />

        <button
          v-if="!areCommentsLoading && !isCommentFormVisible"
          type="button"
          class="button is-link"
          @click="emit('show-comment-form')"
        >
          Write a comment
        </button>

        <CommentForm
          v-if="isCommentFormVisible"
          :is-submitting="isCommentSubmitting"
          @submit="emit('create-comment', $event)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.app-box {
  min-height: 280px;
}
</style>
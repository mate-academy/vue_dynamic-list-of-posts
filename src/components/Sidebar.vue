<script setup>
import { ref, watch } from 'vue';
import PostForm from './PostForm.vue';
import PostPreview from './PostPreview.vue';
import CommentItem from './CommentItem.vue';
import CommentForm from './CommentForm.vue';
import Loader from './Loader.vue';

const props = defineProps({
  isOpen: {
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
  comments: {
    type: Array,
    default: () => [],
  },
  areCommentsLoading: {
    type: Boolean,
    default: false,
  },
  commentsError: {
    type: String,
    default: null,
  },
  userId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  'savePost',
  'editPost',
  'deletePost',
  'addComment',
  'deleteComment',
  'close',
]);

const showCommentForm = ref(false);
const savedName = ref('');
const savedEmail = ref('');

watch(() => props.post, () => {
  showCommentForm.value = false;
});

const handleSavePost = (postData) => {
  emit('savePost', postData);
};

const handleEditPost = () => {
  emit('editPost');
};

const handleDeletePost = () => {
  emit('deletePost');
};

const handleAddComment = async (commentData) => {
  savedName.value = commentData.name;
  savedEmail.value = commentData.email;
  return await emit('addComment', commentData);
};

const handleDeleteComment = (commentId) => {
  emit('deleteComment', commentId);
};

const handleCancelComment = () => {
  showCommentForm.value = false;
};
</script>

<template>
  <div :class="['tile is-parent is-8-desktop Sidebar', { 'Sidebar--open': isOpen }]">
    <div class="tile is-child box is-success">
      <div class="content">
        <PostForm
          v-if="mode === 'create' || mode === 'edit'"
          :post="mode === 'edit' ? post : null"
          @save="handleSavePost"
          @cancel="$emit('close')"
        />

        <div v-else-if="mode === 'view' && post">
          <PostPreview
            :post="post"
            @edit="handleEditPost"
            @delete="handleDeletePost"
          />

          <hr />

          <div class="block">
            <h3 class="title is-5">Comments</h3>

            <div
              v-if="areCommentsLoading"
              class="is-flex is-justify-content-center is-align-items-center mt-2"
            >
              <Loader />
            </div>

            <div v-else-if="commentsError" class="notification is-danger">
              {{ commentsError }}
            </div>

            <div v-else-if="comments.length === 0" class="block">
              <p class="title is-4">No comments yet</p>
            </div>

            <div v-else>
              <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @delete="handleDeleteComment(comment.id)"
              />
            </div>

            <button
              v-if="!showCommentForm && !areCommentsLoading"
              type="button"
              class="button is-link mt-3"
              @click="showCommentForm = true"
            >
              Write a comment
            </button>

            <div v-if="showCommentForm" class="mt-3">
              <CommentForm
                :saved-name="savedName"
                :saved-email="savedEmail"
                @submit="handleAddComment"
                @cancel="handleCancelComment"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

@media (min-width: 769px) {
  .Sidebar {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .Sidebar--open {
    max-width: 50%;
  }
}
</style>

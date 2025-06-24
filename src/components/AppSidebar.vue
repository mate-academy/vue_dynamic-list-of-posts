<script setup>
import { ref, watch } from 'vue';
import { createComment, getCommentsByPostId, removeComment } from '@/api/comments';
import AddPost from './AddPost.vue';
import PostComment from './PostComment.vue';
import PostPreview from './PostPreview.vue';
import AppLoader from './AppLoader.vue';
import CommentForm from './CommentForm.vue';

const props = defineProps({
  isActive: Boolean,
  selectedPost: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['deletePost', 'closeSidebar', 'createPost', 'updatePost']);

const isEditingPost = ref(false);
const comments = ref([]);
const isLoadingComments = ref(false);
const isCommentFormOpen = ref(false);
const errorMessage = ref('');

const hasPostId = () => Boolean(props.selectedPost.id);

const handleCreateComment = async (commentData) => {
  try {
    const data = { ...commentData, postId: props.selectedPost.id };

    const { data: newComment } = await createComment(data);

    comments.value.push(newComment);
    closeCommentForm();
  } catch (error) {
    console.error('Failed to create comment:', error);
    errorMessage.value = 'Something went wrong with creating comment!';
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await removeComment(commentId);

    comments.value = comments.value.filter((comment) => comment.id !== commentId);
  } catch (error) {
    console.error('Failed to delete comment:', error);
    errorMessage.value = 'Something went wrong with deleting comment!';
  }
};

const closeForm = () => {
  if (hasPostId()) {
    isEditingPost.value = false;
  } else {
    emit('closeSidebar');
  }
};

const closeCommentForm = () => {
  isCommentFormOpen.value = false;
  errorMessage.value = '';
};

const loadComments = async (postId) => {
  if (!postId) {
    comments.value = [];

    return;
  }

  isLoadingComments.value = true;

  try {
    const { data } = await getCommentsByPostId(postId);

    comments.value = data;
  } catch (error) {
    console.error('Failed to load comments:', error);
    errorMessage.value = 'Something went wrong!';
  } finally {
    isLoadingComments.value = false;
  }
};

watch(
  () => props.selectedPost,
  (newPost) => {
    isEditingPost.value = false;
    loadComments(newPost?.id);
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="tile is-parent box ml-5 Sidebar" :class="{ 'Sidebar--open': isActive }">
    <div class="tile is-child">
      <div class="content">
        <template v-if="hasPostId() && !isEditingPost">
          <PostPreview
            :selected-post="selectedPost"
            @delete-post="emit('deletePost', $event)"
            @update-post="isEditingPost = true"
          />

          <template v-if="!isCommentFormOpen">
            <div
              class="is-flex is-justify-content-center is-align-items-center mt-2"
              v-if="isLoadingComments"
            >
              <AppLoader />
            </div>

            <div class="block" v-else-if="comments.length === 0">
              <p class="title is-4">No comments yet</p>
            </div>

            <template v-else>
              <PostComment
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @delete-comment="handleDeleteComment"
              />
            </template>

            <button type="button" class="button is-link" @click="isCommentFormOpen = true">
              Write a comment
            </button>

            <div class="block error-message" v-if="errorMessage && !isLoadingComments">
              <p>{{ errorMessage }}</p>
            </div>
          </template>

          <CommentForm
            v-else
            @create-comment="handleCreateComment"
            @close-form="closeCommentForm"
            :error="errorMessage"
          />
        </template>

        <AddPost
          v-else
          :selected-post="selectedPost"
          @close-form="closeForm"
          @create-post="emit('createPost', $event)"
          @update-post="emit('updatePost', $event)"
        />
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

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

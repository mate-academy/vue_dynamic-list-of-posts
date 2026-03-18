<script setup>
import { ref } from 'vue';
import AppLoader from '../Base/AppLoader.vue';
import CommentItem from '../Comments/CommentItem.vue';
import NoComments from '../Comments/NoComments.vue';
import WriteCommentBtn from '../Comments/WriteCommentBtn.vue';
import CommentForm from '../Comments/CommentForm.vue';

defineProps({
  post: { type: Object, required: true },
  comments: { type: Array, required: true },
  isLoadingComments: { type: Boolean, required: true },
  isCommentSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(['delete', 'edit', 'add-comment', 'delete-comment']);
const isAddingComment = ref(false);

const handleCommentSubmit = (commentData) => {
  emit('add-comment', commentData);
  isAddingComment.value = false;
};
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2 class="title is-4">#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-clickable" @click="emit('edit')"
          ><i class="fas fa-pen-to-square"></i
        ></span>
        <span
          class="icon is-small has-text-danger is-clickable ml-3"
          @click="emit('delete', post.id)"
          ><i class="fas fa-trash"></i
        ></span>
      </div>
    </div>
    <p class="mt-4" data-cy="PostBody">{{ post.body }}</p>
  </div>
  <hr />
  <div class="block">
    <AppLoader v-if="isLoadingComments" />
    <template v-else>
      <template v-if="comments.length > 0">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @delete="emit('delete-comment', $event)"
        />
      </template>
      <NoComments v-else />
      <div class="mt-5">
        <CommentForm
          v-if="isAddingComment"
          :post-id="post.id"
          :is-submitting="isCommentSubmitting"
          @close="isAddingComment = false"
          @submit="handleCommentSubmit"
        />
        <WriteCommentBtn v-else @click="isAddingComment = true" />
      </div>
    </template>
  </div>
</template>

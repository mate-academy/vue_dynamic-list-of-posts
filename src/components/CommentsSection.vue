<script setup>
import { onMounted, ref } from 'vue';
import { deleteComment, getComments } from '../api';
import CommentItem from './CommentItem.vue';
import NewCommentForm from './NewCommentForm.vue';
import PostLoader from './PostLoader.vue';

const props = defineProps({ postId: { type: Number, required: true } });

const comments = ref([]);
const loading = ref(true);
const error = ref(false);
const formVisible = ref(false);
const failedIds = ref([]);

async function load() {
  loading.value = true;
  error.value = false;

  try {
    comments.value = await getComments(props.postId);
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

async function removeComment(comment) {
  const index = comments.value.findIndex((item) => item.id === comment.id);

  if (index === -1) {
    return;
  }

  failedIds.value = failedIds.value.filter((id) => id !== comment.id);
  comments.value.splice(index, 1);

  try {
    await deleteComment(comment.id);
  } catch {
    comments.value.splice(Math.min(index, comments.value.length), 0, comment);
    failedIds.value.push(comment.id);
  }
}

onMounted(load);
</script>

<template>
  <div class="block" data-cy="CommentsSection">
    <PostLoader v-if="loading" />

    <div v-else-if="error" class="notification is-danger" data-cy="CommentsError">
      Something went wrong while loading the comments.
      <button type="button" class="button is-small is-light ml-3" @click="load">
        Try again
      </button>
    </div>

    <template v-else>
      <div v-if="!comments.length" class="block" data-cy="NoCommentsMessage">
        <p class="title is-4">No comments yet</p>
      </div>

      <template v-else>
        <p class="title is-4">Comments:</p>
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :failed="failedIds.includes(comment.id)"
          @delete="removeComment(comment)"
        />
      </template>

      <button
        v-if="!formVisible"
        type="button"
        class="button is-link"
        data-cy="WriteCommentButton"
        @click="formVisible = true"
      >
        Write a comment
      </button>

      <NewCommentForm
        v-else
        :post-id="postId"
        @added="comments.push($event)"
      />
    </template>
  </div>
</template>

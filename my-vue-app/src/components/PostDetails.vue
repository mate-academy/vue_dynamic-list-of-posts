<script setup>
import { ref, watch } from 'vue';
import CommentForm from './CommentForm.vue';

const props = defineProps(['post']);
defineEmits(['edit', 'delete']);

const comments = ref([]);
const isLoading = ref(false);
const hasError = ref(false);
const isAddingComment = ref(false);

const commentDeleteErrorId = ref(null); // ID komentarza, którego nie udało się usunąć

const fetchComments = async (postId) => {
  isLoading.value = true;
  hasError.value = false;
  commentDeleteErrorId.value = null;
  try {
    const response = await fetch(`https://mate.academy/students-api/comments?postId=${postId}`);
    if (!response.ok) throw new Error();
    comments.value = await response.json();
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.post.id, (newId) => {
  if (newId) {
    fetchComments(newId);
    isAddingComment.value = false;
  }
}, { immediate: true });

const deleteComment = async (commentId) => {
  commentDeleteErrorId.value = null; // reset bledu
  const originalComments = [...comments.value];
  comments.value = comments.value.filter(c => c.id !== commentId);

  try {
    const res = await fetch(`https://mate.academy/students-api/comments/${commentId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
  } catch {
    comments.value = originalComments; // przywracamy komentarz
    commentDeleteErrorId.value = commentId; // rejestrujemy błąd dla tego ID
  }
};

const handleCommentAdded = (newComment) => {
  comments.value.push(newComment);
  // USUNIĘTE isAddingComment.value = false; - wymóg mentora (formularz zostaje otwarty)
};
</script>

<template>
  <div class="box">
    <div class="is-flex is-justify-content-space-between mb-4">
      <h2 class="title is-4">#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <button class="button is-white" @click="$emit('edit')">
          <span class="icon"><i class="fas fa-edit"></i></span>
        </button>
        <button class="button is-white has-text-danger" @click="$emit('delete', post.id)">
          <span class="icon"><i class="fas fa-trash"></i></span>
        </button>
      </div>
    </div>

    <p class="content">{{ post.body }}</p>
    <hr />
    <h3 class="title is-5 mb-4">Comments</h3>

    <div v-if="hasError" class="notification is-danger">
      CommentsError: Failed to load comments. <button class="button is-small is-light" @click="fetchComments(post.id)">Retry</button>
    </div>

    <div v-if="commentDeleteErrorId" class="notification is-danger mb-4">
      <button class="delete" @click="commentDeleteErrorId = null"></button>
      Failed to delete comment.
      <button class="button is-small is-light ml-2" @click="deleteComment(commentDeleteErrorId)">Retry</button>
    </div>

    <div v-else-if="isLoading" class="has-text-centered py-4">
      <div class="button is-loading is-white is-large"></div>
    </div>

    <div v-else>
      <p v-if="comments.length === 0" class="has-text-grey mb-4">No comments yet</p>

      <div v-for="comment in comments" :key="comment.id" class="message is-small mb-3">
        <div class="message-header has-background-dark py-2 px-3">
          <p class="is-marginless">{{ comment.name }}</p>
          <button class="delete is-small" aria-label="delete" @click="deleteComment(comment.id)"></button>
        </div>
        <div class="message-body py-2 px-3">
          {{ comment.body }}
        </div>
      </div>

      <button v-if="!isAddingComment" class="button is-link" @click="isAddingComment = true">
        Write a comment
      </button>

      <CommentForm
        v-else
        :postId="post.id"
        @added="handleCommentAdded"
        @cancel="isAddingComment = false"
      />
    </div>
  </div>
</template>

// stores/useCommentsStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getComments,
  createComment,
  deleteComment,
} from '@/api/comments';

export const useCommentsStore = defineStore('comments', () => {
  const comments = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchComments = async (postId) => {
    isLoading.value = true;
    try {
      comments.value = await getComments(postId);
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  const addComment = async (body) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newComment = await createComment(body);
      comments.value.push(newComment);
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };
  

  const removeComment = async (id) => {
    error.value = null;
    try {
      await deleteComment(id);
      comments.value = comments.value.filter(c => c.id !== id);
    } catch (err) {
      error.value = err;
    }
  };
  

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    removeComment,
  };
});

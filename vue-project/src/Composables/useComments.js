import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'https://mate-academy.github.io/fe-students-api';

export function useComments() {
  const comments = ref([]);
  const loadingComments = ref(false);
  const commentsError = ref(null);

  const fetchComments = async (postId) => {
    loadingComments.value = true;
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
      comments.value = response.data;
    } catch (error) {
      commentsError.value = error.message;
    } finally {
      loadingComments.value = false;
    }
  };

  const createComment = async (postId, commentData) => {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, commentData);
    return response.data;
  };

  const deleteComment = async (postId, commentId) => {
    await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`);
  };

  return {
    comments,
    loadingComments,
    commentsError,
    fetchComments,
    createComment,
    deleteComment,
  };
}
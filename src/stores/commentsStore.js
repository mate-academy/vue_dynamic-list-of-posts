import { defineStore } from "pinia";
import { ref } from "vue";
import { getCommentsByPostId } from "@/api/comments";

const useCommentsStore = defineStore("comments", () => {
  const comments = ref([]);
  const isLoading = ref(false);
  const commentsError = ref("");

  const init = (postId) => {
    const saved = localStorage.getItem(`comments-${postId}`);
    if (saved) {
      comments.value = JSON.parse(saved);
    }
  };

  const fetchCommentsByPostId = async (postId) => {
    isLoading.value = true;

    try {
      const response = await getCommentsByPostId(postId);
      comments.value = response.data;
      localStorage.setItem(
        `comments-${postId}`,
        JSON.stringify(comments.value),
      );
    } catch (error) {
      commentsError.value = `Error loading comments: ${error}. \n Please try again..`;
    } finally {
      isLoading.value = false;
    }
  };

  const addComment = (comment, postId) => {
    comments.value.push(comment);
    localStorage.setItem(`comments-${postId}`, JSON.stringify(comments.value));
  };

  const removeComment = (commentId, postId) => {
    comments.value = comments.value.filter(
      (comment) => comment.id !== commentId,
    );
    localStorage.setItem(`comments-${postId}`, JSON.stringify(comments.value));
  };

  return {
    comments,
    isLoading,
    commentsError,
    fetchCommentsByPostId,
    addComment,
    removeComment,
    init,
  };
});

export default useCommentsStore;

import { ref, type Ref } from "vue";
import type { PostComment } from "../types/Comment";

export function useCommentFormState(params: { comments: Ref<PostComment[]> }) {
  const { comments } = params;

  const isCommentFormVisible = ref(false);

  const commentAuthor = ref<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  function showCommentForm() {
    isCommentFormVisible.value = true;
  }

  function hideCommentForm() {
    isCommentFormVisible.value = false;
  }

  function resetCommentFormUI() {
    isCommentFormVisible.value = false;
  }

  function onSavedAuthor(payload: { name: string; email: string }) {
    commentAuthor.value = payload;
  }

  function onCommentSubmitted(newComment: PostComment) {
    comments.value.push(newComment);
  }

  return {
    isCommentFormVisible,
    commentAuthor,
    showCommentForm,
    hideCommentForm,
    resetCommentFormUI,
    onSavedAuthor,
    onCommentSubmitted,
  };
}

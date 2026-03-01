import { ref, type Ref } from "vue";
import type { PostComment } from "../types/Comment";

export function useCommentDeletion(params: {
  comments: Ref<PostComment[]>;
  deleteCommentApi: (commentId: number) => Promise<unknown>;
}) {
  const { comments, deleteCommentApi } = params;

  const deletingCommentIds = ref<number[]>([]);
  const deleteCommentError = ref<string | null>(null);
  const failedDeleteCommentId = ref<number | null>(null);

  async function handleDeleteComment(commentId: number) {
    deleteCommentError.value = null;
    failedDeleteCommentId.value = null;

    if (deletingCommentIds.value.includes(commentId)) return;
    deletingCommentIds.value = [...deletingCommentIds.value, commentId];

    const prevComments = comments.value;
    comments.value = comments.value.filter((c) => c.id !== commentId);

    try {
      await deleteCommentApi(commentId);
    } catch (e) {
      comments.value = prevComments;
      failedDeleteCommentId.value = commentId;
      deleteCommentError.value =
        e instanceof Error ? e.message : "Failed to delete comment";
    } finally {
      deletingCommentIds.value = deletingCommentIds.value.filter(
        (id) => id !== commentId,
      );
    }
  }

  function resetCommentDeleteState() {
    deletingCommentIds.value = [];
    deleteCommentError.value = null;
    failedDeleteCommentId.value = null;
  }

  return {
    deletingCommentIds,
    deleteCommentError,
    failedDeleteCommentId,
    handleDeleteComment,
    resetCommentDeleteState,
  };
}
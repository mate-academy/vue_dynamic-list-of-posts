import { ref } from "vue";
import type { PostComment } from "../types/Comment";
import { getCommentsByPostId } from "../api/comments";

export function useComments() {
  const comments = ref<PostComment[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadComments = async (postId: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      comments.value = await getCommentsByPostId(postId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load comments";
    } finally {
      isLoading.value = false;
    }
  };

  const clear = () => {
    comments.value = [];
    error.value = null;
    isLoading.value = false;
  };

  return { comments, isLoading, error, loadComments, clear };
}

import { ref, type Ref } from "vue";
import type { Post } from "../types/Post";

export function usePostDeletion(params: {
  posts: Ref<Post[]>;
  selectedPost: Ref<Post | null>;
  onAfterOptimisticDelete: () => void;
  deletePostApi: (postId: number) => Promise<unknown>;
}) {
  const { posts, selectedPost, onAfterOptimisticDelete, deletePostApi } =
    params;

  const isDeletingPost = ref(false);
  const deletePostError = ref<string | null>(null);

  async function handleDeletePost() {
    if (!selectedPost.value) return;

    deletePostError.value = null;
    isDeletingPost.value = true;

    const idToDelete = selectedPost.value.id;

    const prevPosts = posts.value;
    posts.value = posts.value.filter((p) => p.id !== idToDelete);

    try {
      await deletePostApi(idToDelete);

      onAfterOptimisticDelete();
    } catch (e) {
      posts.value = prevPosts;
      deletePostError.value =
        e instanceof Error ? e.message : "Failed to delete post";
    } finally {
      isDeletingPost.value = false;
    }
  }

  function resetPostDeleteState() {
    isDeletingPost.value = false;
    deletePostError.value = null;
  }

  return {
    isDeletingPost,
    deletePostError,
    handleDeletePost,
    resetPostDeleteState,
  };
}

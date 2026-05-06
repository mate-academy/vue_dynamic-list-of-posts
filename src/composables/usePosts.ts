import { ref } from "vue";
import type { Post } from "../types/Post";
import { getPosts } from "../api/posts";

export function usePosts() {
  const posts = ref<Post[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadPosts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      posts.value = await getPosts();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load posts";
    } finally {
      isLoading.value = false;
    }
  };

  return { posts, isLoading, error, loadPosts };
}

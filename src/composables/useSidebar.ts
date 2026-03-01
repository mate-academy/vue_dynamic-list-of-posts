import { ref, computed } from "vue";
import type { Post } from "../types/Post";

export type SidebarMode = "none" | "create" | "view" | "edit";

export function useSidebar() {
  const sidebarMode = ref<SidebarMode>("none");
  const selectedPost = ref<Post | null>(null);

  const isSidebarOpen = computed(() => sidebarMode.value !== "none");
  const selectedPostId = computed(() => selectedPost.value?.id ?? null);

  function openCreate() {
    selectedPost.value = null;
    sidebarMode.value = "create";
  }

  function openPost(post: Post) {
    const isSamePost = selectedPost.value?.id === post.id;
    const isViewing = sidebarMode.value === "view";

    if (isSamePost && isViewing) {
      closeSidebar();
      return;
    }

    selectedPost.value = post;
    sidebarMode.value = "view";
  }

  function openEdit() {
    if (!selectedPost.value) return;
    sidebarMode.value = "edit";
  }

  function closeSidebar() {
    selectedPost.value = null;
    sidebarMode.value = "none";
  }

  function viewPost(post: Post) {
    selectedPost.value = post;
    sidebarMode.value = "view";
  }

  return {
    sidebarMode,
    selectedPost,
    selectedPostId,
    isSidebarOpen,
    openCreate,
    openPost,
    openEdit,
    viewPost,
    closeSidebar,
  };
}

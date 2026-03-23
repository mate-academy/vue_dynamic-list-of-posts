import {
  createPost,
  deletePost,
  getPostById,
  getPostsByUserId,
  patchPost,
} from "@/api/posts";
import { defineStore } from "pinia";
import { ref } from "vue";

const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const activePostId = ref(null);
  const isLoading = ref(false);
  const postsError = ref("");

  const init = (userId) => {
    const saved = localStorage.getItem(`posts-${userId}`);
    if (saved) {
      posts.value = JSON.parse(saved);
    }
  };

  const getPostByIdFromServer = async (postId) => {
    try {
      const response = await getPostById(postId);

      return response.data;
    } catch (error) {
      postsError.value = `Error fetching post by ID: ${error}`;
      return null;
    }
  };

  const setActivePost = (postId) => {
    if (activePostId.value === postId) {
      activePostId.value = null;
    } else {
      activePostId.value = postId;
    }
  };

  const fetchPostsByUserId = async (userId) => {
    isLoading.value = true;

    try {
      const response = await getPostsByUserId(userId);

      posts.value = response.data;
      localStorage.setItem(`posts-${userId}`, JSON.stringify(posts.value));
    } catch (error) {
      postsError.value = `Error fetching posts: ${error}`;
    } finally {
      isLoading.value = false;
    }
  };

  const addPost = async (postData) => {
    try {
      const response = await createPost(postData);

      posts.value.push(response.data);
      localStorage.setItem(
        `posts-${response.data.userId}`,
        JSON.stringify(posts.value),
      );
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const removePost = async (postId, userId) => {
    try {
      await deletePost(postId);

      posts.value = posts.value.filter((post) => post.id !== postId);
      localStorage.setItem(`posts-${userId}`, JSON.stringify(posts.value));
    } finally {
      isLoading.value = false;
    }
  };

  const updatePost = async (postId, updateData) => {
    try {
      const response = await patchPost(postId, updateData);
      const updatedPost = response.data;

      const index = posts.value.findIndex((post) => post.id === postId);

      if (index !== -1) {
        posts.value[index] = updatedPost;
      }

      localStorage.setItem(
        `posts-${updatedPost.userId}`,
        JSON.stringify(posts.value),
      );
    } finally {
      isLoading.value = false;
    }
  };

  return {
    posts,
    activePostId,
    isLoading,
    postsError,
    init,
    addPost,
    getPostByIdFromServer,
    setActivePost,
    fetchPostsByUserId,
    removePost,
    updatePost,
  };
});

export default usePostsStore;

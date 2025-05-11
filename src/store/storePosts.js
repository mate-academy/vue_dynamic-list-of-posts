import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPosts,
} from "@/api/posts";

export const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const selectedPost = ref(null);
  const isLoading = ref(false);
  const isCreating = ref(false);
  const isEditing = ref(false);
  const error = ref(null);

  const setIsCreating = (value) => {
    selectedPost.value = null;
    isEditing.value = false;
    isCreating.value = value;
  };

  const setIsEditing = (value) => {
    if (!value) {
      selectedPost.value = null;
    }
    isEditing.value = value;
    isCreating.value = false;
  };

  const setSelectedPost = (value) => {
    selectedPost.value = value;
    isCreating.value = false;
    isEditing.value = false;
  };

  const fetchPosts = async (userId) => {
    isLoading.value = true;
    try {
      posts.value = await getPosts(userId);
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchPostById = async (id) => {
    try {
      isCreating.value = false;
      isEditing.value = false;
      selectedPost.value = await getPostById(id);
    } catch (err) {
      error.value = err;
    }
  };

  const addPost = async (body) => {
    error.value = null;
    let newPost;
    try {
      newPost = await createPost(body);
      posts.value.push(newPost);
    } catch (err) {
      error.value = err;
    } finally {
    }

    return newPost;
  };

  const editPost = async (id, body) => {
    error.value = null;
    let updated;
    try {
      updated = await updatePost(id, body);
      posts.value = posts.value.map((p) => (p.id === id ? updated : p));
    } catch (err) {
      error.value = err;
    } finally {
    }

    return updated;
  };

  const removePost = async (id) => {
    error.value = null;
    try {
      selectedPost.value = null;
      posts.value = posts.value.filter((p) => p.id !== id);
      await deletePost(id);
    } catch (err) {
      error.value = err;
    }
  };

  return {
    posts,
    selectedPost,
    isLoading,
    isCreating,
    isEditing,
    error,
    setIsCreating,
    fetchPosts,
    fetchPostById,
    addPost,
    editPost,
    removePost,
    setSelectedPost,
    setIsEditing,
  };
});

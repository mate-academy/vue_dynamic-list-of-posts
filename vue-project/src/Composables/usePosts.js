import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'https://mate-academy.github.io/fe-students-api';

export function usePosts() {
  const posts = ref([]);
  const loadingPosts = ref(false);
  const postsError = ref(null);

  const fetchPosts = async () => {
    loadingPosts.value = true;
    try {
      const response = await axios.get(`${API_URL}/posts`);
      posts.value = response.data;
    } catch (error) {
      postsError.value = error.message;
    } finally {
      loadingPosts.value = false;
    }
  };

  const createPost = async (postData) => {
    const response = await axios.post(`${API_URL}/posts`, postData);
    return response.data;
  };

  const updatePost = async (postId, postData) => {
    const response = await axios.put(`${API_URL}/posts/${postId}`, postData);
    return response.data;
  };

  const deletePost = async (postId) => {
    await axios.delete(`${API_URL}/posts/${postId}`);
  };

  return {
    posts,
    loadingPosts,
    postsError,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
}
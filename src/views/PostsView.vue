<template>
  <div>
    <div v-if="isLoading">
      <Loader />
    </div>
    <div v-else-if="hasError" class="notification is-danger">
      Failed to load posts. Please try again.
    </div>
    <PostsList v-else-if="posts.length" :posts="posts" />
    
  </div>
</template>

<script>
import PostsList from '../components/PostsList.vue';
import Loader from '../components/Loader.vue';
import axios from 'axios';

export default {
  components: { PostsList, Loader },
  data() {
    return {
      posts: [],
      isLoading: true,
      hasError: false,
    };
  },
  async created() {
    try {
      const response = await axios.get(
        'https://mate-academy.github.io/fe-students-api/posts'
      );
      // Fix: Use response.data.data (the actual posts array)
      this.posts = Array.isArray(response.data.data) ? response.data.data : [];
    } catch (e) {
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

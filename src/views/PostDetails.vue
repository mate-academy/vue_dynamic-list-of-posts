<template>
  <div v-if="post && post.title">
    <h2>{{ post.title }}</h2>
    <p>{{ post.body }}</p>
    <button @click="deletePost">Delete Post</button>
    <h3>Comments</h3>
    <ul>
      <li v-for="comment in comments" :key="comment.id">
        {{ comment.body }} -
        <button @click="deleteComment(comment.id)">Delete</button>
      </li>
    </ul>
    <input v-model="newComment" placeholder="Write a comment..." />
    <button @click="addComment">Add Comment</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const post = ref(null);
    const comments = ref([]);
    const newComment = ref('');

    onMounted(async () => {
      try {
        const postId = route.params.id;

        const postResponse = await axios.get(
          `https://mate-academy.github.io/fe-students-api/posts/${postId}`
        );
        post.value = postResponse.data?.data || null;

        const commentsResponse = await axios.get(
          `https://mate-academy.github.io/fe-students-api/comments?postId=${postId}`
        );
        comments.value = commentsResponse.data.data;
      } catch (error) {
        console.error('Failed to fetch post or comments:', error);
      }
    });

    const addComment = async () => {
      if (!newComment.value) return;
      const response = await axios.post(
        `https://mate-academy.github.io/fe-students-api/comments`,
        {
          postId: post.value.id,
          body: newComment.value,
        }
      );
      comments.value.push(response.data.data);
      newComment.value = '';
    };

    const deleteComment = async (commentId) => {
      await axios.delete(
        `https://mate-academy.github.io/fe-students-api/comments/${commentId}`
      );
      comments.value = comments.value.filter(
        (comment) => comment.id !== commentId
      );
    };

    return { post, comments, newComment, addComment, deleteComment };
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 10px;
}
</style>

<template>
  <div class="content">
    <h2>{{ title }}</h2>

    <form @submit.prevent="savePost">
      <!-- Inputs -->
      <div class="field">
        <label class="label" for="post-title">Post Title</label>
        <input
          v-model="postTitle"
          id="post-title"
          class="input"
          type="text"
          placeholder="Enter title"
          required
        />
        <p v-if="!postTitle && showError" class="help is-danger">
          Title is required.
        </p>
      </div>

      <div class="field">
        <label class="label" for="post-content">Post Content</label>
        <textarea
          v-model="postContent"
          id="post-content"
          class="textarea"
          placeholder="Write something..."
          required
        ></textarea>
        <p v-if="!postContent && showError" class="help is-danger">
          Content is required.
        </p>
      </div>

      <!-- Buttons -->
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button
            type="button"
            @click="$emit('cancel')"
            class="button is-link is-light"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>

    <div v-if="errorMessage" class="notification is-danger">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    post: Object, // If editing, provide existing post data
  },
  data() {
    return {
      title: this.post ? 'Edit Post' : 'Create a New Post',
      postTitle: this.post ? this.post.title : '',
      postContent: this.post ? this.post.body : '',
      showError: false,
      errorMessage: '',
    };
  },
  watch: {
    post: {
      immediate: true,
      handler(newPost) {
        this.title = newPost ? 'Edit Post' : 'Create a New Post';
        this.postTitle = newPost ? newPost.title : '';
        this.postContent = newPost ? newPost.body : '';
      },
    },
  },
  methods: {
    async savePost() {
      this.showError = true;
      if (!this.postTitle || !this.postContent) return;

      try {
        let response;
        if (this.post) {
          response = await axios.put(
            `https://mate-academy.github.io/fe-students-api/posts/${this.post.id}`,
            {
              title: this.postTitle,
              body: this.postContent,
            }
          );
        } else {
          response = await axios.post(
            'https://mate-academy.github.io/fe-students-api/posts',
            {
              userId: localStorage.getItem('userId'),
              title: this.postTitle,
              body: this.postContent,
            }
          );
        }

        this.resetForm();
        this.$emit('submitPost', response.data.data);
      } catch (error) {
        this.errorMessage = 'Failed to save post. Please try again.';
      }
    },
    resetForm() {
      this.postTitle = '';
      this.postContent = '';
      this.showError = false;
      this.errorMessage = '';
    },
  },
};
</script>

<style scoped>
.content {
  max-width: 600px;
  margin: auto;
}
.notification {
  margin-top: 15px;
}
</style>

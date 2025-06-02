<template>
  <div class="box">
    <h3 class="title is-5">Add a Comment</h3>
    <form @submit.prevent="submitComment">
      <InputField
        v-model="name"
        title="Name"
        name="name"
        placeholder="Enter your name"
        :hasError="showErrors && !name"
        errorText="Name is required."
        data-cy="name-input"
      />

      <InputField
        v-model="email"
        title="Email"
        name="email"
        placeholder="Enter your email"
        :hasError="showErrors && !email"
        errorText="Email is required."
        data-cy="email-input"
      />

      <div class="field">
        <label class="label" for="comment-body">Comment</label>
        <textarea
          v-model="commentBody"
          id="comment-body"
          class="textarea"
          placeholder="Write your comment..."
          required
          @input="clearError('commentBody')"
        ></textarea>
        <p v-if="showErrors && !commentBody" class="help is-danger">
          Comment text is required.
        </p>
      </div>

      <div class="buttons">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
        >
          Submit
        </button>
        <button
          type="button"
          class="button is-light"
          @click="$emit('closeForm')"
        >
          Cancel
        </button>
        <button type="button" class="button is-warning" @click="clearForm">
          Clear
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import InputField from '../views/InputField.vue'; // adjust the path if needed

export default {
  components: {
    InputField,
  },
  props: {
    postId: Number,
  },
  data() {
    return {
      name: localStorage.getItem('name') || '',
      email: localStorage.getItem('email') || '',
      commentBody: '',
      showErrors: false,
      isSubmitting: false,
    };
  },
  methods: {
    async submitComment() {
      this.showErrors = true;
      if (!this.name || !this.email || !this.commentBody) return;

      this.isSubmitting = true;
      try {
        const response = await axios.post(
          'https://mate-academy.github.io/fe-students-api/comments',
          {
            postId: this.postId,
            name: this.name,
            email: this.email,
            body: this.commentBody,
          }
        );

        this.$emit('commentAdded', response.data.data);
        this.commentBody = ''; // Clear only comment text
        localStorage.setItem('name', this.name);
        localStorage.setItem('email', this.email);
        this.showErrors = false;
      } catch (error) {
        alert('Failed to add comment. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    },
    clearError(field) {
      if (this.showErrors) this.showErrors = false;
    },
    clearForm() {
      this.name = '';
      this.email = '';
      this.commentBody = '';
      this.showErrors = false;
    },
  },
};
</script>

<style scoped>
.box {
  margin-top: 10px;
}
</style>

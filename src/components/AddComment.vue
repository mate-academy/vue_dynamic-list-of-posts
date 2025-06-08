<script>
import { createComment } from '@/api/comments';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import Message from './Message.vue';

export default {
  name: 'AddComment',
  components: {
    InputField,
    TextAreaField,
    Message,
  },
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  emits: ['cancel', 'updateCommentsList'],
  data() {
    return {
      newAuthorName: '',
      newAuthorEmail: '',
      newCommentText: '',
      hasErrorText: false,
      hasErrorName: false,
      hasErrorEmail: false,
      isLoading: false,
      errorMessage: '',
    };
  },
  methods: {
    createNewComment() {
      this.errorMessage = '';
      if (!this.validation()) {
        return;
      }

      const newData = {
        body: this.newCommentText,
        email: this.newAuthorEmail,
        name: this.newAuthorName,
        postId: this.postId,
      };

      this.isLoading = true;
      createComment(newData)
        .then(({ data }) => {
          this.newCommentText = '';
          this.newAuthorName = '';
          this.newAuthorEmail = '';
          this.$emit('updateCommentsList', data);
        })
        .catch((error) => {
          console.error('Error creating comment:', error);
          this.errorMessage = 'Failed to add comment. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    cancel() {
      this.$emit('cancel');
    },

    validation() {
      this.hasErrorName = !this.newAuthorName.trim();
      this.hasErrorEmail = !this.newAuthorEmail.trim();
      this.hasErrorText = !this.newCommentText.trim();

      return !(this.hasErrorName || this.hasErrorEmail || this.hasErrorText);
    },
  },
};
</script>

<template>
  <form @submit.prevent="createNewComment">
    <InputField
      v-model.trim="newAuthorName"
      title="Author Name"
      name="authorName"
      placeholder="Name Surname"
      error-text="Name is required"
      :has-error="hasErrorName"
      @remove-err="hasErrorName = false"
    />

    <InputField
      v-model.trim="newAuthorEmail"
      title="Author Email"
      name="authorEmail"
      placeholder="Your Email"
      error-text="Email is required"
      :has-error="hasErrorEmail"
      @remove-err="hasErrorEmail = false"
    />

    <TextAreaField
      v-model.trim="newCommentText"
      title="Write Comment Body"
      name="commentText"
      placeholder="Comment"
      error-text="Body is required"
      :has-error="hasErrorText"
      @remove-err="hasErrorText = false"
    />

    <Message v-if="errorMessage" :type="'is-danger'">
      {{ errorMessage }}
    </Message>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isLoading }"
        >
          Save
        </button>
      </div>
      <div class="control">
        <button
          type="reset"
          class="button is-link is-light"
          :disabled="isLoading"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

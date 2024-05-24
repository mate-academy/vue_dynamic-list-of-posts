<template>
  <div class="content">
    <form @submit.prevent="handleSubmit">
      <NameField
        :title="title"
        :errorMessage="errorMessage.title"
        :inputLabel="'Author Name'"
        :inputType="'text'"
        :inputName="'title'"
        :inputId="'comment-title'"
        :inputPlaceholder="'Name Surname'"
        @update:errorMessage="updateTitleErrorMessage"
        @update:title="updateTitle"
      />
      <NameField
        :title="email"
        :errorMessage="errorMessage.email"
        :inputLabel="'Author Email'"
        :inputType="'email'"
        :inputName="'email'"
        :inputId="'comment-email'"
        :inputPlaceholder="'Your Email'"
        @update:errorMessage="updateEmailErrorMessage"
        @update:title="updateEmail"
      />
      <BodyField
        :body="body"
        :errorMessage="errorMessage.body"
        :inputLabel="'Write Comment Body'"
        :inputId="'post-body'"
        :inputName="'postBody'"
        :inputPlaceholder="'Comment'"
        @update:errorMessage="updateBodyErrorMessage"
        @update:body="updateBody"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoading }"
            :disabled="isLoading"
          >
            Add Comment
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="closeForm">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import NameField from './InputField.vue';
import BodyField from './TextAreaField.vue';
import { postComment } from '@/api/comments';
export default {
  name: 'AddPost',
  props: {
    postId: Number
  },
  components: {
    NameField,
    BodyField
  },
  data() {
    return {
      title: '',
      email: '',
      body: '',
      errorMessage: { title: '', email: '', body: '' },
      isLoading: false
    };
  },
  methods: {
    handleSubmit() {
      this.errorMessage = {};
      this.isLoading = true;

      const trimmedTitle = this.title.trim();
      const trimmedEmail = this.email.trim();
      const trimmedBody = this.body.trim();

      if (!trimmedTitle || !trimmedEmail || !trimmedBody) {
        this.isLoading = false;

        this.errorMessage = {
          title: !trimmedTitle ? 'Title is required' : '',
          email: !trimmedEmail ? 'Email is required' : '',
          body: !trimmedBody ? 'Body is required' : ''
        };

        return;
      }

      postComment(this.postId, trimmedTitle, trimmedEmail, trimmedBody)
        .then(({ data }) => {
          this.$emit('comment-added', data);
        })
        .catch(() => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred';
        })
        .finally(() => {
          this.isLoading = false;
          this.closeForm();
        });
    },
    closeForm() {
      this.$emit('close-form');
    },
    updateTitle(title) {
      this.title = title;
    },
    updateEmail(title) {
      this.email = title;
    },
    updateBody(body) {
      this.body = body;
    },
    updateTitleErrorMessage(message) {
      this.errorMessage.title = message;
    },
    updateEmailErrorMessage(message) {
      this.errorMessage.email = message;
    },
    updateBodyErrorMessage(message) {
      this.errorMessage.body = message;
    }
  }
};
</script>
<style></style>

<template>
  <div class="content">
    <h2>Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <NameField
        :title="title"
        :errorMessage="errorMessage.title"
        :inputLabel="'Title'"
        :inputType="'text'"
        :inputName="'title'"
        :inputId="'post-title'"
        :inputPlaceholder="'Post title'"
        @update:errorMessage="updateTitleErrorMessage"
        @update:title="updateTitle"
      />
      <BodyField
        :body="body"
        :errorMessage="errorMessage.body"
        :inputLabel="'Write Post Body'"
        :inputId="'post-body'"
        :inputName="'postBody'"
        :inputPlaceholder="'Post body'"
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
            Create
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
import { createPost } from '@/api/posts';
import NameField from './InputField.vue';
import BodyField from './TextAreaField.vue';
export default {
  name: 'AddPost',
  props: {
    userId: Number
  },
  components: {
    NameField,
    BodyField
  },
  data() {
    return {
      title: '',
      body: '',
      errorMessage: { title: '', body: '' },
      isLoading: false
    };
  },

  methods: {
    handleSubmit() {
      this.errorMessage = {};

      const trimmedTitle = this.title.trim();
      const trimmedBody = this.body.trim();
      this.isLoading = true;

      if (!trimmedTitle || !trimmedBody) {
        this.isLoading = false;

        this.errorMessage = {
          title: !trimmedTitle ? 'Title is required' : '',
          body: !trimmedBody ? 'Title is required' : ''
        };

        return;
      }

      createPost(this.userId, trimmedTitle, trimmedBody)
        .then(({ data }) => {
          this.$emit('post-added', data);
        })
        .catch(() => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred';
        })
        .finally(() => (this.isLoading = false));
    },
    closeForm() {
      this.$emit('close-form');
    },
    updateTitle(title) {
      this.title = title;
    },
    updateBody(body) {
      this.body = body;
    },
    updateTitleErrorMessage(message) {
      this.errorMessage.title = message;
    },
    updateBodyErrorMessage(message) {
      this.errorMessage.body = message;
    }
  }
};
</script>
<style></style>

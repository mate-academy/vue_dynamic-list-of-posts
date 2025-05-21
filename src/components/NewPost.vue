<script>
import { addPost } from '../api/api';

export default {
  name: 'NewPost',
  props: {
    user: Object,
    isPostAdd: Boolean,
  },
  emits: ['update:isPostAdd', 'post-created'],
  data() {
    return {
      isLoading: false,
      isTitleError: false,
      isBodyError: false,
      title: '',
      body: '',
    };
  },
  methods: {
    closeForm() {
      this.$emit('update:isPostAdd', false);
    },

    async handleSubmit() {
      this.isTitleError = !this.title.trim();
      this.isBodyError = !this.body.trim();

      if (this.isTitleError || this.isBodyError) {
        return;
      }

      this.isLoading = true;

      try {
        const { data: newPost } = await addPost(
          this.user.id,
          this.title,
          this.body
        );

        this.title = '';
        this.body = '';

        this.$emit('update:isPostAdd', false);
        this.$emit('post-created', newPost);
      } catch (error) {
        console.error('Failed to create post:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <div class="content">
    <h2>Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <div class="field" data-cy="NameField">
        <label class="label" for="post-title"> Title </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="title"
            v-model="title"
            @input="isTitleError = false"
            id="post-title"
            placeholder="Post title"
            class="input"
            :class="{ 'is-danger': isTitleError }"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span
            v-if="isTitleError"
            class="icon is-small is-right has-text-danger"
            data-cy="ErrorIcon"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
          <p class="help is-danger" data-cy="ErrorMessage" v-if="isTitleError">
            Title is required
          </p>
        </div>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="post-body"> Write Post Body </label>
        <div class="control">
          <textarea
            id="post-body"
            name="body"
            v-model="body"
            @input="isBodyError = false"
            placeholder="Post body"
            class="textarea"
            :class="{ 'is-danger': isBodyError }"
          ></textarea>
        </div>
        <p class="help is-danger" data-cy="ErrorMessage" v-if="isBodyError">
          Body is required
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoading }"
          >
            Create
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="closeForm"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { updatePost } from '../api/api';

export default {
  name: 'EditPost',
  props: {
    post: Object,
  },
  data() {
    return {
      title: this.post.title,
      body: this.post.body,
      isLoading: false,
      isTitleError: false,
      isBodyError: false,
    };
  },
  methods: {
    cancel() {
      this.$emit('cancel-edit');
    },
    async save() {
      this.isTitleError = !this.title.trim();
      this.isBodyError = !this.body.trim();

      if (this.isTitleError || this.isBodyError) {
        return;
      }

      this.isLoading = true;
      try {
        const { data: updatedPost } = await updatePost({
          id: this.post.id,
          title: this.title,
          body: this.body,
        });
        this.$emit('post-updated', updatedPost);
      } catch (error) {
        console.error('Failed to update post:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <div class="content">
    <h2>Post editing</h2>

    <form @submit.prevent="save">
      <div class="field" data-cy="NameField">
        <label class="label" for="post-title"> Title </label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="title"
            id="post-title"
            placeholder="Post title"
            v-model="title"
            class="input"
            :class="{ 'is-danger': isTitleError }"
            @input="isTitleError = false"
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
            placeholder="Post body"
            v-model="body"
            class="textarea"
            :class="{ 'is-danger': isBodyError }"
            @input="isBodyError = false"
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
            Save
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="cancel">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

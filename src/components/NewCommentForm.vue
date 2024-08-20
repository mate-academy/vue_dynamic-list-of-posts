<script>
import { postComment } from '@/api/comments';

export default {
  props: {
    postId: Number,
  },
  data() {
    return {
      title: '',
      email: '',
      message: '',
      hasTitleError: false,
      hasEmailError: false,
      hasMessageError: false,
      isLoading: false,
    }
  },
  emits: ['addComment'],
  methods: {
    reset() {
      this.title = '';
      this.email = '';
      this.message = '';
    },
    async handleSubmit()  {
      if (this.title === '') {
        this.hasTitleError = true; 
      }

      if (this.email === '') {
        this.hasEmailError = true; 
      }

      if (this.message === '') {
        this.hasMessageError = true; 
      }

      if (this.title && this.message && this.email) {
        this.isLoading = true; 
        try {
          const newComment = await postComment({
            postId: this.postId,
            name: this.title,
            email: this.email,
            body: this.message,
          });

          this.$emit('addComment', newComment.data);
          this.reset();
        } finally {
          this.isLoading = false; 
        }
      }
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label" for="comment-author-name"> Author Name </label>

      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="name"
          id="comment-author-name"
          placeholder="Name Surname"
          autoFocus
          class="input"
          :class="{ 'is-danger': hasTitleError }"
          v-model.trim="title"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-user" />
        </span>

        <template v-if="hasTitleError">
          <span class="icon is-small is-right has-text-danger">
            <i class="fas fa-exclamation-triangle" />
          </span>

          <p class="help is-danger">Name is required</p>
        </template>
      </div>
    </div>

    <div class="field">
      <label class="label" htmlFor="comment-author-email"> Author Email </label>

      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="email"
          id="comment-author-email"
          placeholder="email@test.com"
          class="input"
          :class="{ 'is-danger': hasEmailError }"
          v-model.trim="email"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>

        <template v-if="hasEmailError">
          <span class="icon is-small is-right has-text-danger">
            <i class="fas fa-exclamation-triangle" />
          </span>

          <p class="help is-danger">Email is required</p>
        </template>
      </div>
    </div>

    <div class="field">
      <label class="label" for="comment-body"> Comment Text </label>

      <div class="control">
        <textarea
          id="comment-body"
          name="body"
          placeholder="Type comment here"
          class="textarea"
          :class="{ 'is-danger': hasMessageError }"
          v-model.trim="message"
        />
      </div>

      <p class="help is-danger" v-if="hasMessageError">Enter some text</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isLoading }"
        >
          Add
        </button>
      </div>

      <div class="control">
        <button type="reset" class="button is-link is-light" @click="reset">
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

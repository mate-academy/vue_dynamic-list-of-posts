<script>
import { addPost } from '../api/posts';

export default {
  name: 'postForm',
  data() {
    return {
      loading: false,
      title: this.post ? this.post.title : '',
      titleError: false,
      body: this.post ? this.post.body : '',
      bodyError: false,
    }
  },
  props: {
    sidebar: Boolean,
    post: Object,
    editing: Boolean,
  },
  emits: ['handleSidebar', 'updatePost'],
  methods: {
    handleSubmit() {
      this.loading = true;
      const postId = this.post ? this.post.id : null;


      if (!this.title) {
        this.titleError = true;
      }
      const title = this.title;

      if (!this.body) {
        this.bodyError = true;
      }
      const body = this.body;

      if (this.titleError || this.bodyError) {
        this.loading = false;
        return;
      }
      const userId = 1416;

      if (this.editing) {
        this.$emit('updatePost', { postId, title, body })
      } else if (!this.editing) {
        addPost({ userId, title, body }).finally(() => this.loading = false)
      }
    }
  },
  watch: {
    title(newTitle, oldTitle) {
      if (newTitle !== oldTitle) {
        this.titleError = false;
      }
    },

    body(newBody, oldBody) {
      if (newBody !== oldBody) {
        this.bodyError = false;
      }
    }
  }
}
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': sidebar }">
    <div class="tile is-child box is-success">
      <div class="content">

        <form @submit.prevent="handleSubmit">
          <h2 v-if="editing">Post editing</h2>
          <h2 v-else>Create new post</h2>
          <!-- inputs... -->
          <div class="field" data-cy="NameField">
            <label class="label" for="comment-author-name-title">Title</label>
            <div class="control has-icons-left has-icons-right">
              <input type="text" name="title" id="comment-author-name-title" placeholder="Post title" class="input"
                :class="{ 'is-danger': titleError }" v-model.trim="title">
              <span class="icon is-small is-left">
                <i class="fas fa-user fa-heading"></i>
              </span>

              <span className="icon is-small is-right has-text-danger" data-cy="ErrorIcon" v-if="titleError">
                <i className="fas fa-exclamation-triangle"></i>
              </span>
            </div>
            <p className="help is-danger" data-cy="ErrorMessage" v-if="titleError">Title is required</p>
          </div>

          <div class="field" data-cy="BodyField">
            <label class="label" for="comment-body">Write Comment Body</label>
            <div class="control">
              <textarea id="comment-body" name="body" placeholder="Post body" class="textarea"
                :class="{ 'is-danger': bodyError }" v-model.trim="body"></textarea>
            </div>
            <p className="help is-danger" data-cy="ErrorMessage" v-if="bodyError">Body is required</p>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button type="submit" class="button is-link" :class="{ 'is-loading': loading }" v-if="editing">
                Edit
              </button>
              <button type="submit" class="button is-link" :class="{ 'is-loading': loading }" v-else>
                Create
              </button>
            </div>
            <div class="control" @click="$emit('handleSidebar')">
              <button type="reset" class="button is-link is-light">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

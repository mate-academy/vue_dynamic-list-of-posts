<script>
  import InputField from './InputField.vue'
  import TextAreaField from './TextAreaField.vue'
  import { addPost } from '../api/posts'

  export default {
    name: 'AddPostForm',
    components: { InputField, TextAreaField },
    props: {
      formName: String,
      userId: Number,
      selectedPost: Object,
    },
    data() {
      return {
        title: '',
        body: '',
        inputError: '',
        bodyError: '',
        submitError: '',
        isLoadingSubmit: false,
      }
    },
    emits: ['addPost', 'updatePost', 'closeEditing', 'closeSidebar'],
    mounted() {
      this.initForm();
    },
    watch: {
      formName: 'initForm',
      selectedPost: {
        handler: 'initForm',
      },
    },
    methods: {
      initForm() {
        if (this.formName === 'editPost' && this.selectedPost) {
          this.title = this.selectedPost.title;
          this.body = this.selectedPost.body;
        } else if (this.formName === 'createPost') {
          this.title = '';
          this.body = '';
        }
      },
      clearErrors() {
        this.inputError = ''
        this.bodyError = ''
        this.submitError = ''
      },
      handleSubmit() {
        const titleTrimmed = this.title.trim()
        const bodyTrimmed = this.body.trim()

        if (!titleTrimmed) {
          this.inputError = 'Title is required'
        }

        if (!bodyTrimmed) {
          this.bodyError = 'Body is required'
        }

        if (this.inputError || this.bodyError) {
          return;
        }

        this.submitError = '';

        const userId = this.userId || this.selectedPost.userId
        const postId = this.selectedPost?.id

        if (this.formName === 'createPost') {
          this.isLoadingSubmit = true;

          addPost({ userId, title: titleTrimmed, body: bodyTrimmed })
          .then(({ data }) => {
            this.$emit('addPost', data)
          })
          .catch(() => {
            this.submitError = 'Failed to create post. Please check your network and try again.';
          })
          .finally(() => {
            this.isLoadingSubmit = false;
          });
        } else {
          this.$emit('updatePost', { postId, title: titleTrimmed, body: bodyTrimmed })
          this.$emit('closeEditing')
        }
      },
    },
  }
</script>

<template>
  <div class="content">
    <h2>{{ formName === 'createPost' ? 'Create new post' : 'Post editing' }}</h2>

    <div v-if="submitError" class="notification is-danger is-light">
        {{ submitError }}
    </div>

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        label="Title"
        placeholder="Post title"
        icon="fa-user"
        :inputError="inputError"
        id="post-title"
        @input="clearErrors"
      />

      <TextAreaField
        v-model="body"
        label="Body"
        placeholder="Post body"
        id="post-body"
        :bodyError="bodyError"
        @input="clearErrors"
      />

      <div class="field is-grouped mt-3">
        <div class="control">
          <button 
            type="submit" class="button is-link" 
            :class="{ 'is-loading': isLoadingSubmit }"
          >
            {{ formName === 'createPost' ? 'Create' : 'Save' }}
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-light"
            @click="formName === 'createPost' ? $emit('closeSidebar') : $emit('closeEditing')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>

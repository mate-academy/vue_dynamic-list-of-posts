<script>
import InputField from './InputField.vue';
import TextareaField from './TextareaField.vue';
import { textCheck } from '../utils/textCheck';
import { createPost, updatePost } from '../api/post';

  export default {
    name: "PostForm",
    data() {
      const { status, post } = this;

      return {
        title: (status === 'update') ? post.title : '',
        body: (status === 'update') ? post.body : '',
        titleError: '',
        bodyError: '',
      }
    },
    components: {
      InputField,
      TextareaField
    },
    props: {
      status: String,
      post: Object,
    },
    emits: ['update-status-form', 'update-posts', 'update-preview-id'],
    methods: {
      async handleSubmit() {
        const { status, title, body, $emit } = this;

        this.titleError = textCheck(title, 'Title');
        this.bodyError = textCheck(body, 'Body');

        if (this.titleError || this.bodyError) {
          return;
        }

        let post;

        if (status === 'create') {
          post = await createPost({
            title,
            body,
          });
        }

        if (status === 'update') {
          post = await updatePost({
            id: this.post.id,
            title,
            body,
          })
        }

        $emit('update-posts');
        $emit('update-status-form', 'off');
        $emit('update-preview-id', (status === 'create') ? post.data.id : this.post.id);
      },
    },
  }
</script>

<template>
  <div className="content">
    <h2>{{ (status === 'create') ? 'Create new post' : 'Post editing'}}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        type="text"
        name="Title"
        placeholder="Post title"
        :textError="titleError"
      />

      <TextareaField
        v-model="body"
        name="Write Post Body"
        placeholder="Post body"
        :textError="bodyError"
      />

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            {{ (status === 'create') ? 'Create' : 'Save'}}
          </button>
        </div>

        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            @click="$emit('update-status-form', 'off'); (status === 'update') ? $emit('update-preview-id', post.id) : ''"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

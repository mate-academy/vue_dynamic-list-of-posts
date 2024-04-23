<script>
  import { createPost, updatePost } from '@/api/posts';
  import InputField from './InputField.vue';
  import TextAreaField from './TextAreaField.vue';
  import MessageComponent from './MessageComponent.vue';
  import PostLoader from './PostLoader.vue';

  export default {
    name: 'AddPost',
    components: {
      InputField,
      TextAreaField,
      MessageComponent,
      PostLoader,
    },
    emits: ['close', 'add-post', 'post-updated'],
    props: {
      title: String,
      userId: Number,
      postToEdit: Object || undefined,
    },
    data() {
      return {
        newTitle: this.postToEdit ? this.postToEdit.title : '',
        errorTitle: '',
        errorPostBody: '',
        postBody: this.postToEdit ? this.postToEdit.body : '',
        errorMessage: '',
        loading: false,
      };
    },
    watch: {
      newTitle: {
        handler() {
          if (this.errorTitle) {
            this.errorTitle = '';
          }
        },
      },
      postBody: {
        handler() {
          if (this.errorPostBody) {
            this.errorPostBody = '';
          }
        },
      }
    },
    methods: {
      handlerCloseSidebar() {
        this.$emit('close');
      },
      handlerSubmit() {
        this.errorMessage = '';
        this.newTitle = this.newTitle.trim();
        this.postBody = this.postBody.trim();

        if (!this.newTitle) {
          this.errorTitle = 'Title is required'
        }
        if (!this.postBody) {
          this.errorPostBody = 'Body is required'
        }
        if (this.errorTitle || this.errorPostBody) {
          return;
        }
        
        this.loading = true;

        if (this.postToEdit) {
          updatePost(this.postToEdit.id, this.newTitle, this.postBody)
            .then(({ data }) => {
              this.$emit('post-updated', data);
            })
            .catch(() => {
              this.errorMessage = 'Unable to update post';
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          createPost(this.userId, this.newTitle, this.postBody)
            .then(({ data }) => {
              this.$emit('add-post', data);
            })
            .catch(() => {
              this.errorMessage = 'Unable to create post';
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
    },
  }
</script>

<template>
  <div class="content">
    <h2>{{ title }}</h2>

    <MessageComponent 
      :active="errorMessage !== ''"
      @hide="errorMessage = ''"
    >
      <p>{{ errorMessage }}</p>
    </MessageComponent>

    <PostLoader v-if="loading" />

    <form @submit.prevent="handlerSubmit" v-else>
      <InputField
        :title="'Title'"
        :inputName="'title'"
        :placeholder="'Post title'"
        :errorMessage="errorTitle"
        :type="'text'"
        v-model="newTitle"
      />

      <TextAreaField
        :title="'Write Post Body'"
        :inputName="'post-body'"
        :placeholder="'Post body'"
        :errorMessage="errorPostBody"
        v-model="postBody"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ postToEdit ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button 
          type="reset" 
          class="button is-link is-light"
          @click="handlerCloseSidebar"
        >
          Cancel
        </button>
        </div>
      </div>
    </form>
  </div>
</template>
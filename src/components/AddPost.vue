<script>
import TextAreaField from './TextAreaField.vue';
import InputField from './InputField.vue';
import { createPost, updatePost } from '@/api/post';
import Message from './Message.vue';

export default {
  name: 'AddPost',
  components: {
    InputField,
    TextAreaField,
    Message,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      newPostTitle: this.$store.state.currentPost?.title || '',
      newPostText: this.$store.state.currentPost?.body || '',
      hasErrorTitle: false,
      hasErrorText: false,
      isLoading: false,
      errorMessage: '',
    };
  },

  watch: {
    '$store.state.currentPost': {
      immediate: true,
      deep: true,
      handler(newPost) {
        this.newPostTitle = newPost?.title || '';
        this.newPostText = newPost?.body || '';
        this.hasErrorTitle = false;
        this.hasErrorText = false;
        this.errorMessage = '';
      },
    },
    '$store.state.inSidebar': {
      handler(newValue) {
        if (newValue === 'creatingPost') {
          this.reset();
        }
      },
    },
  },
  methods: {
    send() {
      this.errorMessage = '';
      if (!this.validation()) {
        return;
      }
      const sendData = {
        body: this.newPostText,
        title: this.newPostTitle,
        userId: this.$store.state.userId,
        postId: this.$store.state.currentPost?.id,
      };

      this.isLoading = true;

      if (this.$store.state.inSidebar === 'creatingPost') {
        this.creatingPost(sendData);
      } else {
        this.updatingPost(sendData);
      }
    },

    creatingPost(dataToSend) {
      createPost(dataToSend)
        .then(({ data }) => {
          this.$store.commit('addPostList', data);
          this.$store.commit('setCurrentPost', data);
          this.$store.commit('setInSidebar', 'postDetails');
          this.reset();
        })
        .catch((error) => {
          console.error('Error creating post:', error);
          this.errorMessage = 'Failed to create post. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    updatingPost(dataToSend) {
      updatePost(dataToSend)
        .then(({ data }) => {
          this.$store.commit('updatePost', data);
          this.$store.commit('setCurrentPost', data);
          this.$store.commit('setInSidebar', 'postDetails');
        })
        .catch((error) => {
          console.error('Error updating post:', error);
          this.errorMessage = 'Failed to update post. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    validation() {
      this.hasErrorTitle = !this.newPostTitle.trim();
      this.hasErrorText = !this.newPostText.trim();

      return !(this.hasErrorTitle || this.hasErrorText);
    },

    cancel() {
      if (this.$store.state.inSidebar === 'creatingPost') {
        this.reset();
        this.$store.commit('setInSidebar', '');
      } else {
        this.$store.commit('setInSidebar', 'postDetails');
      }
    },

    reset() {
      this.newPostTitle = '';
      this.newPostText = '';
      this.hasErrorTitle = false;
      this.hasErrorText = false;
      this.errorMessage = '';
    },
  },
};
</script>

<template>
  <div class="content">
    <h2>{{ title }}</h2>

    <form @submit.prevent="send">
      <InputField
        v-model.trim="newPostTitle"
        :has-error="hasErrorTitle"
        name="title"
        title="Title"
        placeholder="Post title"
        error-text="Title is required"
        @remove-err="hasErrorTitle = false"
      />
      <TextAreaField
        v-model.trim="newPostText"
        :has-error="hasErrorText"
        name="postText"
        title="Write Post Body"
        placeholder="Post body"
        error-text="Body is required"
        @remove-err="hasErrorText = false"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="cancel">
            Cancel
          </button>
        </div>
      </div>
      <Message
        v-if="errorMessage"
        type="is-danger"
        icon="fas fa-exclamation-triangle"
      >
        <template #head>
          <p>Error</p>
        </template>
        <p>{{ errorMessage }}</p>
      </Message>
    </form>
  </div>
</template>

<style></style>

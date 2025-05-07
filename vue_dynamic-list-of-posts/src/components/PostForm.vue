<script>
  import InputField from './InputField.vue';
  import TextAreaField from './TextAreaField.vue';
  export default {
    name: 'PostForm',
    props: {
      postForUpdating: Object,
    },
    data () {
      const post = {
        title: '',
        body: '',
      };
      if (this.postForUpdating) {
        post.title = this.postForUpdating.title;
        post.body = this.postForUpdating.body;
      }
      return {
        post,
        titleError: false,
        bodyError: false,
      }
    },
    components : {
      InputField,
      TextAreaField,
    },
    methods: {
      isInputValid(value) {
        return !!value.trim();
      },
      handleSubmit() {
        const { post, isInputValid, postForUpdating } = this;
        this.titleError = !isInputValid(post.title);
        this.bodyError = !isInputValid(post.body);
        if (this.titleError || this.bodyError) {
          return;
        }
      
        const newPost = {
          id: postForUpdating?.id,
          title: post.title,
          body: post.body,
        }
        if (postForUpdating) {
          this.$emit('postUpdating', newPost);
          return;
        }
  
        this.$emit('postCreating', newPost);
      }
    },
    emits: ['close','postCreating', 'postUpdating'],
  }
</script>
<template>
  <div className="content">
  <h2>{{ postForUpdating? 'Post editing':'Create new post' }}</h2>
    <form @submit.prevent="handleSubmit">
      <InputField 
        v-model="post.title"
        type="text"
        label="Title"
        :havingErrors="titleError"
        @update:modelValue="titleError = false"
      />
      <TextAreaField 
        v-model="post.body"
        :havingErrors="bodyError"
        @update:modelValue="bodyError = false"
      /> 
      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            Save
          </button>
        </div>
        <div className="control">
          <button 
            type="reset" 
            className="button is-link is-light"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

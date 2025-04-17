<script>
export default {
  name: 'PostForm',
  props: {
    editing: {
      type: Boolean,
      required: true,
    },
    post: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['closeForm', 'submitHandler'],
  data() {
    return {
      title: '',
      body: '',
      titleError: '',
      bodyError: '',
    };
  },
  mounted() {
    if (this.editing && this.post) {
      this.title = this.post.title;
      this.body = this.post.body;
    }
  },
  methods: {
    validateForm() {
      let isError = false;
      this.titleError = '';
      this.bodyError = '';
      if (!this.title) {
        this.titleError = 'Title is required';
        isError = true;
      }
      if (!this.body) {
        this.bodyError = 'Body is required';
        isError = true;
      }
      return isError;
    },
    submit() {
      if (!this.validateForm()) {
        this.$emit('submitHandler', { title: this.title, body: this.body });
      }
    },
  },
};
</script>

<template>
  <section>
    <h2>{{ editing ? 'Edit post' : 'Create new post' }}</h2>
    <form @submit.prevent="submit">
      <div class="field" data-cy="NameField">
        <label class="label" for="post-title">Title</label>
        <div class="control has-icons-left has-icons-right">
          <input 
            type="text" 
            id="post-title" 
            placeholder="Post Title"
            :class="{ 'is-danger': !!titleError }" 
            class="input" 
            v-model="title" 
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
          <span v-if="titleError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
          <p v-if="titleError" class="help is-danger" data-cy="ErrorMessage">{{ titleError }}</p>
        </div>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="post-body">Write post body</label>
        <div class="control">
          <textarea 
            id="post-body" 
            placeholder="Post body" 
            :class="{ 'is-danger': !!bodyError }"
            class="textarea" 
            v-model="body"
          ></textarea>
        </div>
        <p v-if="bodyError" class="help is-danger" data-cy="ErrorMessage">{{ bodyError }}</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">{{ editing ? 'Save' : 'Create' }}</button>
        </div>
        <div class="control">
          <button type="button" class="button is-link is-light" @click="$emit('closeForm')">Cancel</button>
        </div>
      </div>
    </form>
  </section>
</template>

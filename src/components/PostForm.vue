<script>
export default {
  name: 'CommentForm',
  props: {
    editing: Boolean,
    post: Object,
  },
  emits: ['closeForm', 'submitHandler'],
  data() {
    return {
      title: '',
      body: '',
      titleError: '',
      bodyError: '',
    }
  },
  mounted() {
    if (this.editing) {
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
}
</script>

<template>
  <h2 v-if="!editing">Create new post</h2>
  <h2 v-else>Edit post</h2>
  <form @submit.prevent="submit">
    <div class="field" data-cy="NameField">
      <label class="label" for="{`comment-author-name-${name}`}">
        Title
      </label>
      <div class="control has-icons-left has-icons-right">
        <input type="text" name="{name}" id="{`comment-author-name-${name}`}" placeholder="Your Name"
          :class="{ 'is-danger': !!titleError }" class="input" v-model="this.title" />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span v-if="titleError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>

        <p v-if="titleError" class="help is-danger" data-cy="ErrorMessage">{{ titleError }}</p>
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" for="{`comment-${name}`}"> Write post body </label>
        <div className="control">
          <textarea id="{`comment-${name}`}" name="name" placeholder="Post body" :class="{ 'is-danger': !!bodyError }"
            class="textarea" v-model="this.body"></textarea>
        </div>

        <p v-if="bodyError" class="help is-danger" data-cy="ErrorMessage">{{ bodyError }}</p>
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button v-if="editing" type="submit" class="button is-link">Save</button>
        <button v-else type="submit" class="button is-link">Create</button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" @click="this.$emit('closeForm')">Cancel</button>
      </div>
    </div>
  </form>


</template>
<script>
export default {
  name: 'ArticleForm',
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
    article: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['dismissForm', 'formSubmit'],
  data() {
    return {
      headline: '',
      content: '',
      headlineError: '',
      contentError: '',
    };
  },
  mounted() {
    if (this.isEditing && this.article) {
      this.headline = this.article.title;
      this.content = this.article.body;
    }
  },
  methods: {
    validateInputs() {
      let hasError = false;
      this.headlineError = '';
      this.contentError = '';
      if (!this.headline) {
        this.headlineError = 'Headline is required';
        hasError = true;
      }
      if (!this.content) {
        this.contentError = 'Content is required';
        hasError = true;
      }
      return hasError;
    },
    handleFormSubmit() {
      if (!this.validateInputs()) {
        this.$emit('formSubmit', { title: this.headline, body: this.content });
      }
    },
  },
};
</script>

<template>
  <section>
    <h2>{{ isEditing ? 'Edit Article' : 'Create New Article' }}</h2>
    <form @submit.prevent="handleFormSubmit">
      <div class="field" data-cy="HeadlineField">
        <label class="label" for="article-headline">Headline</label>
        <div class="control has-icons-left has-icons-right">
          <input 
            type="text" 
            id="article-headline" 
            placeholder="Enter Headline"
            :class="{ 'is-danger': !!headlineError }" 
            class="input" 
            v-model="headline" 
          />
          <span class="icon is-small is-left">
            <i class="fas fa-heading"></i>
          </span>
          <span v-if="headlineError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
          <p v-if="headlineError" class="help is-danger" data-cy="ErrorMessage">{{ headlineError }}</p>
        </div>
      </div>

      <div class="field" data-cy="ContentField">
        <label class="label" for="article-content">Content</label>
        <div class="control">
          <textarea 
            id="article-content" 
            placeholder="Write content here" 
            :class="{ 'is-danger': !!contentError }"
            class="textarea" 
            v-model="content"
          ></textarea>
        </div>
        <p v-if="contentError" class="help is-danger" data-cy="ErrorMessage">{{ contentError }}</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">{{ isEditing ? 'Update' : 'Publish' }}</button>
        </div>
        <div class="control">
          <button type="button" class="button is-link is-light" @click="$emit('dismissForm')">Cancel</button>
        </div>
      </div>
    </form>
  </section>
</template>

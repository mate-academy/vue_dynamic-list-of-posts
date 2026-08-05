<script setup lang="ts">
import { reactive, ref } from 'vue';
import { api, type Comment } from '../api';

const props = defineProps<{ postId: number }>();
const emit = defineEmits<{ added: [comment: Comment] }>();
const form = reactive({ name: '', email: '', body: '' });
const errors = reactive({ name: '', email: '', body: '' });
const isSubmitting = ref(false);
const submitError = ref('');

const clearError = (field: keyof typeof errors) => {
  errors[field] = '';
  submitError.value = '';
};

const clear = () => {
  form.name = '';
  form.email = '';
  form.body = '';
  errors.name = '';
  errors.email = '';
  errors.body = '';
  submitError.value = '';
};

const submit = async () => {
  errors.name = form.name.trim() ? '' : 'Name is required';
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? ''
    : 'A valid email is required';
  errors.body = form.body.trim() ? '' : 'Comment is required';
  if (errors.name || errors.email || errors.body) return;

  isSubmitting.value = true;
  submitError.value = '';
  try {
    const comment = await api.createComment({ postId: props.postId, ...form });
    emit('added', comment);
    form.body = '';
  } catch {
    submitError.value = 'Unable to add a comment. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form data-cy="CommentForm" @submit.prevent="submit" @reset.prevent="clear">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-name">Author name</label>
      <div class="control has-icons-left has-icons-right">
        <input id="comment-name" v-model="form.name" class="input" :class="{ 'is-danger': errors.name }" placeholder="Name" @input="clearError('name')" />
        <span class="icon is-small is-left"><i class="fas fa-user" /></span>
        <span v-if="errors.name" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon"><i class="fas fa-exclamation-triangle" /></span>
      </div>
      <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">{{ errors.name }}</p>
    </div>
    <div class="field" data-cy="EmailField">
      <label class="label" for="comment-email">Email</label>
      <div class="control has-icons-left">
        <input id="comment-email" v-model="form.email" class="input" :class="{ 'is-danger': errors.email }" placeholder="Email" @input="clearError('email')" />
        <span class="icon is-small is-left"><i class="fas fa-envelope" /></span>
      </div>
      <p v-if="errors.email" class="help is-danger" data-cy="ErrorMessage">{{ errors.email }}</p>
    </div>
    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Comment</label>
      <textarea id="comment-body" v-model="form.body" class="textarea" :class="{ 'is-danger': errors.body }" placeholder="Write a comment" @input="clearError('body')" />
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">{{ errors.body }}</p>
    </div>
    <p v-if="submitError" class="notification is-danger is-light">{{ submitError }}</p>
    <div class="field is-grouped">
      <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }">Add</button>
      <button type="reset" class="button is-link is-light">Clear</button>
    </div>
  </form>
</template>

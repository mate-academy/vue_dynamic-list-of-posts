<template>
  <form @submit.prevent="submitComment" class="mt-4">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="form.name"
          type="text"
          id="comment-author-name"
          placeholder="Name Surname"
          class="input"
          :class="{ 'is-danger': errors.name }"
          @input="clearError('name')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span v-if="errors.name" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">{{ errors.name }}</p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" for="comment-author-email">Author Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="form.email"
          type="email"
          id="comment-author-email"
          placeholder="Your Email"
          class="input"
          :class="{ 'is-danger': errors.email }"
          @input="clearError('email')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span v-if="errors.email" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger" data-cy="ErrorMessage">{{ errors.email }}</p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Write Post Body</label>
      <div class="control">
        <textarea
          v-model="form.body"
          id="comment-body"
          placeholder="Comment"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          @input="clearError('body')"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">{{ errors.body }}</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light" @click="clearForm">
          Clear
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-text" @click="handleCancel">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { createComment } from './api.js';

const props = defineProps(['postId']);
const emit = defineEmits(['comment-added', 'cancel']);

const form = reactive({
  name: '',
  email: '',
  body: ''
});

const errors = reactive({
  name: '',
  email: '',
  body: ''
});

const isSubmitting = ref(false);

const validate = () => {
  let isValid = true;
  
  if (!form.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }
  
  if (!form.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }
  
  if (!form.body.trim()) {
    errors.body = 'Comment text is required';
    isValid = false;
  }
  
  return isValid;
};

const clearError = (field) => {
  errors[field] = '';
};

const clearForm = () => {
  form.name = '';
  form.email = '';
  form.body = '';
  errors.name = '';
  errors.email = '';
  errors.body = '';
};

const handleCancel = () => {
  clearForm();
  emit('cancel');
};

const submitComment = async () => {
  if (!validate()) return;

  isSubmitting.value = true;

  try {
    const newComment = await createComment({
      postId: props.postId,
      name: form.name,
      email: form.email,
      body: form.body
    });
    
    emit('comment-added', newComment);
    form.body = ''; 
    
  } catch (error) {
    alert('Failed to add comment. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
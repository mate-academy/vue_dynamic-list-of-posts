<script setup>
import { ref } from 'vue';

import { createComment } from '../api/api';

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['comment-added', 'error']);

const nameVal = ref(localStorage.getItem('comment-author-name') || '');
const emailVal = ref(localStorage.getItem('comment-author-email') || '');
const bodyVal = ref('');

const nameError = ref('');
const emailError = ref('');
const bodyError = ref('');
const isSubmitting = ref(false);

const handleInputName = () => {
  nameError.value = '';
};

const handleInputEmail = () => {
  emailError.value = '';
};

const handleInputBody = () => {
  bodyError.value = '';
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleSubmit = async () => {
  let valid = true;

  if (!nameVal.value.trim()) {
    nameError.value = 'Name is required';
    valid = false;
  }

  if (!emailVal.value.trim()) {
    emailError.value = 'Email is required';
    valid = false;
  } else if (!validateEmail(emailVal.value.trim())) {
    emailError.value = 'Email is not valid';
    valid = false;
  }

  if (!bodyVal.value.trim()) {
    bodyError.value = 'Comment text is required';
    valid = false;
  }

  if (!valid) return;

  isSubmitting.value = true;

  try {
    const newComment = await createComment({
      postId: props.postId,
      name: nameVal.value.trim(),
      email: emailVal.value.trim().toLowerCase(),
      body: bodyVal.value.trim(),
    });

    localStorage.setItem('comment-author-name', nameVal.value.trim());
    localStorage.setItem('comment-author-email', emailVal.value.trim().toLowerCase());

    bodyVal.value = '';
    emit('comment-added', newComment);
  } catch (error) {
    emit('error', 'Failed to add comment. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleReset = () => {
  nameVal.value = '';
  emailVal.value = '';
  bodyVal.value = '';
  nameError.value = '';
  emailError.value = '';
  bodyError.value = '';
};
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset.prevent="handleReset" class="box">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name-name">
        Author's Name
      </label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="nameVal"
          @input="handleInputName"
          type="text"
          name="name"
          id="comment-author-name-name"
          placeholder="Your name"
          class="input"
          :class="{ 'is-danger': nameError }"
          :disabled="isSubmitting"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span
          v-if="nameError"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p v-if="nameError" class="help is-danger" data-cy="ErrorMessage">
        {{ nameError }}
      </p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" for="comment-author-name-email">
        Author's Email
      </label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="emailVal"
          @input="handleInputEmail"
          type="email"
          name="email"
          id="comment-author-name-email"
          placeholder="Your email"
          class="input"
          :class="{ 'is-danger': emailError }"
          :disabled="isSubmitting"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>

        <span
          v-if="emailError"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p v-if="emailError" class="help is-danger" data-cy="ErrorMessage">
        {{ emailError }}
      </p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Comment Text</label>
      <div class="control">
        <textarea
          v-model="bodyVal"
          @input="handleInputBody"
          id="comment-body"
          name="body"
          placeholder="Type your comment..."
          class="textarea"
          :class="{ 'is-danger': bodyError }"
          :disabled="isSubmitting"
        ></textarea>
      </div>

      <p v-if="bodyError" class="help is-danger" data-cy="ErrorMessage">
        {{ bodyError }}
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
          :disabled="isSubmitting"
        >
          Submit
        </button>
      </div>
      <div class="control">
        <button
          type="reset"
          class="button is-link is-light"
          :disabled="isSubmitting"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

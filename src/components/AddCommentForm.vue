<script setup>
import { ref, watch } from 'vue';
import * as commentsApi from '@/api/comments';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const emit = defineEmits(['commentAdded', 'closeSidebar']);

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const title = ref('');
const email = ref('');
const content = ref('');
const error = ref('');
const errorTitle = ref('');
const errorEmail = ref('');
const errorBody = ref('');
const isLoading = ref(false);

watch(email, newEmail => {
  if (newEmail.includes('@')) {
    errorEmail.value = '';
  }
});

const handleSubmit = async () => {
  errorTitle.value = '';
  errorEmail.value = '';
  errorBody.value = '';

  if (!title.value) {
    errorTitle.value = 'Author name is required';
  }
  if (!email.value || !email.value.includes('@')) {
    errorEmail.value = 'A valid email is required';
  }
  if (!content.value) {
    errorBody.value = 'Comment body is required';
  }

  if (errorTitle.value || errorEmail.value || errorBody.value) {
    return;
  }

  try {
    isLoading.value = true;

    const newComment = await commentsApi.addComment({
      postId: props.post.id,
      name: title.value,
      email: email.value,
      body: content.value,
    });

    emit('commentAdded', newComment);

    title.value = '';
    email.value = '';
    content.value = '';

    emit('closeSidebar');
  } catch (err) {
    error.value = 'Failed to add comment. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="block">
    <form @submit.prevent="handleSubmit">
      <InputField
        v-model.trim="title"
        title="Author Name"
        :error-message="errorTitle"
        name="title"
        placeholder="Name Surname"
      />

      <InputField
        v-model.trim="email"
        title="Author Email"
        :error-message="errorEmail"
        name="title"
        placeholder="Your email"
      />

      <TextAreaField
        v-model="content"
        title="Write Comment Body"
        :error-message="errorBody"
        name="body"
        placeholder="Comment body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoading }"
          >
            Add Comment
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="emit('closeSidebar')"
          >
            Cancel
          </button>
        </div>
      </div>

      <div v-if="error" class="has-text-danger">
        <p>{{ error }}</p>
      </div>
    </form>
  </div>
</template>

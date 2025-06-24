<script setup>
import { ref, watch } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const props = defineProps({
  selectedPost: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['closeForm', 'createPost', 'updatePost']);

const formData = ref({
  title: '',
  body: '',
});

const errors = ref({});

const isEditing = () => Boolean(props.selectedPost.id);

watch(
  () => props.selectedPost,
  (newPost) => {
    if (newPost?.id) {
      formData.value = {
        title: newPost.title || '',
        body: newPost.body || '',
      };
    } else {
      formData.value = { title: '', body: '' };
    }
  },
  { deep: true, immediate: true },
);

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
};

const validateField = (field) => {
  if (!formData.value[field]?.trim()) {
    errors.value[field] = `${field} is required!`;

    return false;
  }
  clearError(field);

  return true;
};

const validateForm = () => {
  const titleValid = validateField('title');
  const bodyValid = validateField('body');

  return titleValid && bodyValid;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  const postData = {
    title: formData.value.title.trim(),
    body: formData.value.body.trim(),
  };

  if (isEditing()) {
    emit('updatePost', { ...props.selectedPost, ...postData });
  } else {
    emit('createPost', postData);
    formData.value = { title: '', body: '' };
  }
};

const formTitle = () => (isEditing() ? 'Editing Post' : 'Create new post');
</script>

<template>
  <div class="content">
    <h2>{{ formTitle() }}</h2>

    <form @submit.prevent="handleSubmit" @reset="emit('closeForm')">
      <InputField
        v-model="formData.title"
        input-name="postTitle"
        :input-error="errors.title"
        @remove-error="clearError('title')"
      />

      <TextAreaField
        v-model="formData.body"
        text-area-name="postBody"
        :text-area-error="errors.body"
        @remove-error="clearError('body')"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>

        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>

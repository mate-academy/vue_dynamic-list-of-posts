<script setup>
import { ref } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

defineProps({
  error: String,
});

const emit = defineEmits(['createComment', 'closeForm']);

const formData = ref({
  name: '',
  email: '',
  body: '',
});

const errors = ref({});

const emailPattern = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
};

const validateForm = () => {
  const newErrors = {};

  if (!formData.value.name?.trim()) {
    newErrors.name = 'Name is required!';
  }

  if (!formData.value.email?.trim()) {
    newErrors.email = 'Email is required!';
  } else if (!emailPattern.test(formData.value.email.trim())) {
    newErrors.email = 'Email is not valid!';
  }

  if (!formData.value.body?.trim()) {
    newErrors.body = 'Comment is required!';
  }

  errors.value = newErrors;

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  const commentData = {
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    body: formData.value.body.trim(),
  };

  emit('createComment', commentData);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset="emit('closeForm')" novalidate>
    <InputField
      v-model="formData.name"
      input-name="commentAuthor"
      :input-error="errors.name"
      @remove-error="clearError('name')"
    />

    <InputField
      v-model="formData.email"
      input-name="commentAuthorEmail"
      :input-error="errors.email"
      @remove-error="clearError('email')"
    />

    <TextAreaField
      v-model="formData.body"
      text-area-name="commentBody"
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

  <div class="block error-message" v-if="error">
    <p class="title is-6">{{ error }}</p>
  </div>
</template>

<style></style>

<script setup>
import { ref, watch } from 'vue';
import FormBlock from './FormBlock.vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const emit = defineEmits(['update', 'closeSidebar']);

const props = defineProps({
  title: String,
  post: { type: Object, default: null }
});

const formData = ref({
  title: props.post?.title || '',
  body: props.post?.body || ''
});

const error = ref({
  title: '',
  body: '',
});

const fillForm = (eventFormData) => {
  const title = eventFormData.get('postTitle');
  const body = eventFormData.get('postBody');

  formData.value.title = title;
  formData.value.body = body;

  error.value.title = title ? '' : 'Title is required';
  error.value.body = body ? '' : 'Body is required';

  if (title && body) {
    emit("update", { title, body });
  }
};

const closeSidebar = () => {
  emit('closeSidebar');
};

const clearError = (field) => {
  error.value[field] = '';
};

watch(() => props.post, (newPost) => {
  formData.value.title = newPost?.title || '';
  formData.value.body = newPost?.body || '';
});
</script>

<template>
  <FormBlock @close-sidebar="closeSidebar" @submit="fillForm($event)" :title="title">
    <InputField 
      label="Title" 
      :error="error.title" 
      name="postTitle" 
      v-model="formData.title"
      @input="clearError('title')" 
    />

    <TextAreaField 
      label="Write Post Body" 
      :error="error.body" 
      name="postBody" 
      v-model="formData.body"
      @input="clearError('body')" 
    />
  </FormBlock>
</template>

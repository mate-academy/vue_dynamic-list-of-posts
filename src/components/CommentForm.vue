<script setup>
import { ref } from 'vue';
import FormBlock from './FormBlock.vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const emit = defineEmits(['closeForm', 'submit']);

const props = defineProps({
  postId: Number,
})

const formData = ref({
  name: '',
  email: '',
  body: '',
});

const error = ref({
  name: '',
  email: '',
  body: '',
});

const fillForm = (eventFormData) => {
  const name = eventFormData.get('userName');
  const email = eventFormData.get('userEmail');
  const body = eventFormData.get('comment');

  formData.value.name = name;
  formData.value.email = email;
  formData.value.body = body;

  error.value.name = name ? '' : 'Name is required';
  error.value.email = email ? '' : 'Email is required';
  error.value.body = body ? '' : 'Body is required';

  const commentData = { postId: props.postId, name, email, body };

  if (name && email && body) {
    emit('submit', commentData);
  }
};

const closeForm = () => {
  emit('closeForm');
};

const clearError = (field) => {
  error.value[field] = '';
};
</script>

<template>
  <FormBlock @close-sidebar="closeForm" @submit="fillForm($event)">
    <InputField label="Your Name" :error="error.name" name="userName" v-model="formData.name"
      @input="clearError('name')" />

    <InputField label="Your Email" :error="error.email" name="userEmail" v-model="formData.email"
      @input="clearError('email')" />

    <TextAreaField label="Write Comment" :error="error.body" name="comment" v-model="formData.body"
      @input="clearError('body')" />
  </FormBlock>
</template>

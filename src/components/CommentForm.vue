<script setup>
import { onMounted, ref } from 'vue';
import FormBlock from './FormBlock.vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const emit = defineEmits(['closeForm', 'submit']);

const props = defineProps({
  btnCls: Boolean,
  postId: Number,
})

const formData = ref({
  name: '',
  email: '',
  body: '',
});

const error = ref({});

onMounted(() => {
  const savedName = localStorage.getItem('name');
  const savedEmail = localStorage.getItem('email');

  if (savedName) {
    formData.value.name = savedName;
  }
  if (savedEmail) {
    formData.value.email = savedEmail;
  }
});

const validateForm = (formValues) => {
  error.value = {};

  for (const field in formValues) {
    if (formValues[field].trim() === '') {
      error.value[field] = `${field} is required`
    }

    if (field === 'email' && !formValues[field].includes('@')) {
      error.value.email = 'invalid email address'
    }
  }
}

const fillForm = (eventFormData) => {
  const formValues = Object.fromEntries(eventFormData.entries());

  validateForm(formValues);
  formData.value = { ...formValues };

  const { name, email, body } = formData.value;

  const postId = props.postId;

  if (!Object.keys(error.value).length) {
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    emit('submit', { postId, name, email, body });
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
  <FormBlock :btn-cls="btnCls" @close-sidebar="closeForm" @submit="fillForm($event)">
    <InputField label="Your Name" :error="error.name" name="name" v-model="formData.name" @input="clearError('name')" />

    <InputField label="Your Email" :error="error.email" name="email" v-model="formData.email"
      @input="clearError('email')" />

    <TextAreaField label="Write Comment" :error="error.body" name="body" v-model="formData.body"
      @input="clearError('body')" />
  </FormBlock>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },

  successCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['submit-comment']);

const name = ref('');
const email = ref('');
const body = ref('');

const nameError = ref('');
const emailError = ref('');
const bodyError = ref('');

const handleSubmit = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  nameError.value = '';
  emailError.value = '';
  bodyError.value = '';

  if (!name.value.trim()) {
    nameError.value = 'Name is required';
  }

  if (!email.value.trim()) {
    emailError.value = 'Email is required';
  } else if (!emailPattern.test(email.value)) {
    emailError.value = 'Enter a valid email';
  }

  if (!body.value.trim()) {
    bodyError.value = 'Comment is required';
  }

  if (
    nameError.value ||
    emailError.value ||
    bodyError.value
  ) {
    return;
  }

  emit('submit-comment', {
      name: name.value,
      email: email.value,
      body: body.value,
    });
};

const handleClear = () => {
  name.value = '';
  email.value = '';
  body.value = '';

  nameError.value = '';
  emailError.value = '';
  bodyError.value = '';
};

watch(
  () => props.successCount,
  () => {
    body.value = '';
    bodyError.value = '';
  }
);
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <InputField
      v-model="name"
      title="Author Name"
      name="name"
      type="text"
      placeholder="Your name"
      :has-error="Boolean(nameError)"
      :error-message="nameError"
      @update:model-value="nameError = ''"
    />

    <InputField
      v-model="email"
      title="Email"
      name="email"
      type="email"
      placeholder="Your email"
      :has-error="Boolean(emailError)"
      :error-message="emailError"
      @update:model-value="emailError = ''"
    />

    <TextAreaField
      v-model="body"
      title="Comment"
      name="body"
      placeholder="Write a comment"
      :has-error="Boolean(bodyError)"
      :error-message="bodyError"
      @update:model-value="bodyError = ''"
    />

    <div class="buttons">
      <button
        type="submit"
        class="button is-link"
        :class="{ 'is-loading': isLoading }"
        :disabled="isLoading"
      >
        Add comment
      </button>

      <button
        type="button"
        class="button is-light"
        @click="handleClear"
      >
        Clear
      </button>
    </div>
  </form>
</template>
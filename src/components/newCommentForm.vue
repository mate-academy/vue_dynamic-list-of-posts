<script setup lang="ts">
import { ref, computed, onMounted} from 'vue';
import client from '../utils/http';
import { Comment } from '../types/Comment';
import InputField from '../blocks/inputField.vue';
import TextAreaField from '../blocks/textAreaField.vue';
import { deleteComment } from '../api/comments';

const props = defineProps<{ postId: number }>();
const emit = defineEmits<{
  (e: 'added', comment: Comment): void
}>();

const name = ref('');
const email = ref('');
const body = ref('');
const isSubmitting = ref(false);

const nameError = ref('');
const emailError = ref('');
const bodyError = ref('');


const onNameChange = (val: string) => {
  name.value = val;
  if (nameError.value) nameError.value = ''; // прибираємо помилку при зміні
};

const onEmailChange = (val: string) => {
  email.value = val;
  if (emailError.value) emailError.value = '';
};

const onBodyChange = (val: string) => {
  body.value = val;
  if (bodyError.value) bodyError.value = '';
};

const validate = (): boolean => {
  let valid = true;

  if (!name.value.trim()) {
    nameError.value = 'Name is required';
    valid = false;
  }

  if (!email.value.trim()) {
    emailError.value = 'Email is required';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    emailError.value = 'Email is not valid';
    valid = false;
  }

  if (!body.value.trim()) {
    bodyError.value = 'Comment text is required';
    valid = false;
  }

  return valid;
};


const handleSubmit = async () => {
  // Показуємо помилки лише після сабміту
  if (!validate()) return;

  isSubmitting.value = true;
  try {
    const response = await client.post<Comment>('/comments', {
      postId: props.postId,
      name: name.value.trim(),
      email: email.value.trim(),
      body: body.value.trim(),
    });
    emit('added', response.data);
    // Зберігаємо name і email, очищаємо тільки body
    body.value = '';
    bodyError.value = '';
  } catch {
    bodyError.value = 'Failed to send comment. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

// Clear — очищає всі поля І всі помилки
const handleClear = () => {
  name.value = '';
  email.value = '';
  body.value = '';
  nameError.value = '';
  emailError.value = '';
  bodyError.value = '';
};
</script>

<template>
  <form @submit.prevent="handleSubmit" data-cy="NewCommentForm">

    <InputField
      :modelValue="name"
      @update:modelValue="onNameChange"
      v-model:errorMessage="nameError"
      title="Author Name"
      name="name"
      placeholder="Name Surname"
    />

    <InputField
      :modelValue="email"
      @update:modelValue="onEmailChange"
      title="Author Email"
      name="email"
      type="email"
      placeholder="email@test.com"
      v-model:errorMessage="emailError"
    />

    <TextAreaField
      :modelValue="body"
      @update:modelValue="onBodyChange"
      title="Comment Text"
      name="body"
      placeholder="Type comment here"
      v-model:errorMessage="bodyError"
    />

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
          data-cy="NewCommentSubmit"
        >
          Add
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="handleClear"
          data-cy="NewCommentReset"
        >
          Clear
        </button>
      </div>
    </div>

  </form>
</template>
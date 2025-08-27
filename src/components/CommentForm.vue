<template>
  <form @submit.prevent="submitComment">
    <!-- Name Field -->
    <div class="field">
      <label class="label">Author Name</label>
      <div
        class="control has-icons-left"
        :class="{ 'has-icons-right': errors.name }"
      >
        <input
          v-model.trim="name"
          class="input"
          :class="{ 'is-danger': errors.name }"
          name="name"
          placeholder="Name Surname"
          @input="validateField('name')"
        />
        <span class="icon is-small is-left">
          <i class="fa-solid fa-user"></i>
        </span>
        <span v-if="errors.name" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle has-text-danger"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger">Name is required</p>
    </div>

    <!-- Email Field -->
    <div class="field">
      <label class="label">Author Email</label>
      <div
        class="control has-icons-left"
        :class="{ 'has-icons-right': errors.email }"
      >
        <input
          v-model.trim="email"
          type="email"
          class="input"
          :class="{ 'is-danger': errors.email }"
          name="email"
          placeholder="Your Email"
          @input="validateField('email')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span v-if="errors.email" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle has-text-danger"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger">Email is required</p>
    </div>

    <!-- Body Field -->
    <div class="field">
      <label class="label">Write Post Body</label>
      <div class="control" :class="{ 'has-icons-right': errors.body }">
        <textarea
          v-model.trim="body"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          placeholder="Comment"
          @input="validateField('body')"
        ></textarea>
        <span v-if="errors.body" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle has-text-danger"></i>
        </span>
      </div>
      <p v-if="errors.body" class="help is-danger">Comment is required</p>
    </div>

    <!-- Buttons -->
    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': loading }"
          :disabled="loading"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-inverted"
          @click="clearForm"
          :disabled="loading"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Ошибка при запросе -->
    <div v-if="errorMessage" class="notification is-danger is-light">
      <p>{{ errorMessage }}</p>
      <button class="button is-small is-danger mt-2" @click="retrySubmit">
        Retry
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { addCommentApi } from '../api/index.js';

const props = defineProps({ postId: Number });
const emit = defineEmits(['comment-added', 'cancel']);

const name = ref('');
const email = ref('');
const body = ref('');

const errors = reactive({
  name: false,
  email: false,
  body: false,
});

const loading = ref(false);
const errorMessage = ref('');

// Валидация
const isFormValid = () => {
  let isValid = true;
  if (!name.value) {
    errors.name = true;
    isValid = false;
  }
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = true;
    isValid = false;
  }
  if (!body.value) {
    errors.body = true;
    isValid = false;
  }
  return isValid;
};

const validateField = (field) => {
  if (field === 'name') errors.name = !name.value;
  if (field === 'email') errors.email = !email.value || !/\S+@\S+\.\S+/.test(email.value);
  if (field === 'body') errors.body = !body.value;
};

const clearErrors = () => {
  errors.name = false;
  errors.email = false;
  errors.body = false;
};

// Сабмит
const submitComment = async () => {
  clearErrors();
  errorMessage.value = '';

  if (!isFormValid()) return;

  loading.value = true;

  const comment = {
    postId: props.postId,
    name: name.value,
    email: email.value,
    body: body.value,
  };

  try {
    const newComment = await addCommentApi(comment);

    // очищаем только тело комментария
    body.value = '';
    errors.body = false;

    emit('comment-added', newComment);
  } catch (err) {
    console.error('Failed to add comment:', err);
    errorMessage.value = 'Failed to send comment. Please try again.';
  } finally {
    loading.value = false;
  }
};

const retrySubmit = () => {
  submitComment();
};

const clearForm = () => {
  name.value = '';
  email.value = '';
  body.value = '';
  clearErrors();
  errorMessage.value = '';
  emit('cancel');
};
</script>

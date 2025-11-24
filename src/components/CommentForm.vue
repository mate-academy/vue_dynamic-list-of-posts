<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  savedName: {
    type: String,
    default: '',
  },
  savedEmail: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['submit', 'cancel']);

const name = ref(props.savedName);
const email = ref(props.savedEmail);
const body = ref('');
const errors = ref({
  name: '',
  email: '',
  body: '',
});
const isSubmitted = ref(false);
const isLoading = ref(false);

watch(() => props.savedName, (newName) => {
  name.value = newName;
});

watch(() => props.savedEmail, (newEmail) => {
  email.value = newEmail;
});

const clearError = (field) => {
  if (isSubmitted.value) {
    errors.value[field] = '';
  }
};

const validate = () => {
  let isValid = true;
  errors.value = { name: '', email: '', body: '' };

  if (!name.value.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  }

  if (!email.value.trim()) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Email is invalid';
    isValid = false;
  }

  if (!body.value.trim()) {
    errors.value.body = 'Comment is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  isSubmitted.value = true;
  
  if (!validate()) {
    return;
  }

  isLoading.value = true;
  
  const success = await emit('submit', {
    name: name.value,
    email: email.value,
    body: body.value,
  });

  isLoading.value = false;

  if (success !== false) {
    body.value = '';
    isSubmitted.value = false;
  }
};

const handleCancel = () => {
  name.value = props.savedName;
  email.value = props.savedEmail;
  body.value = '';
  errors.value = { name: '', email: '', body: '' };
  isSubmitted.value = false;
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label" for="comment-author-name">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          id="comment-author-name"
          placeholder="Enter your name"
          :class="['input', { 'is-danger': errors.name }]"
          v-model="name"
          @input="clearError('name')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span
          v-if="errors.name"
          class="icon is-small is-right has-text-danger"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label class="label" for="comment-author-email">Author Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="email"
          id="comment-author-email"
          placeholder="Enter your email"
          :class="['input', { 'is-danger': errors.email }]"
          v-model="email"
          @input="clearError('email')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span
          v-if="errors.email"
          class="icon is-small is-right has-text-danger"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label class="label" for="comment-body">Comment</label>
      <div class="control">
        <textarea
          id="comment-body"
          placeholder="Enter your comment"
          :class="['textarea', { 'is-danger': errors.body }]"
          v-model="body"
          @input="clearError('body')"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button 
          type="submit" 
          :class="['button', 'is-link', { 'is-loading': isLoading }]"
          :disabled="isLoading"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="handleCancel"
          :disabled="isLoading"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

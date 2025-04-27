<template>
  <form @submit.prevent="submit">
    <div class="field" data-cy="NameField">
      <label class="label" :for="`comment-author-name-${form.name}`">Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="form.name"
          :class="{ 'is-danger': errors.name }"
          type="text"
          :name="form.name"
          :id="`comment-author-name-${form.name}`"
          placeholder="Enter your name"
          class="input"
          @input="clearError('name')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span
          v-if="errors.name"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">{{ errors.name }}</p>
    </div>
    <div class="field">
      <label class="label" for="user-email">Email</label>
      <div class="control has-icons-left">
        <input
          v-model="form.email"
          :class="{ 'is-danger': errors.email }"
          type="email"
          id="user-email"
          name="email"
          class="input"
          placeholder="Enter your email"
          @input="clearError('email')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
    </div>
    <div class="field" data-cy="BodyField">
      <label class="label" :for="`comment-${form.name}`">Comment</label>
      <div class="control">
        <textarea
          v-model="form.body"
          :class="{ 'is-danger': errors.body }"
          :id="`comment-${form.name}`"
          name="body"
          placeholder="Enter your comment"
          class="textarea"
          @input="clearError('body')"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">{{ errors.body }}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
        >
          Submit
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="resetForm"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  name: '',
  email: '',
  body: '',
});
const errors = ref({});
const isSubmitting = ref(false);

const validate = () => {
  errors.value = {};
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required';
  }
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Invalid email format';
  }
  if (!form.value.body.trim()) {
    errors.value.body = 'Comment is required';
  }
  return Object.keys(errors.value).length === 0;
};

const submit = async () => {
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    await emit('submit', { ...form.value });
    form.value.body = ''; // Clear comment text, keep name and email
    errors.value = {};
  } finally {
    isSubmitting.value = false;
  }
};

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = '';
  }
};

const resetForm = () => {
  form.value = { name: '', email: '', body: '' };
  errors.value = {};
  emit('cancel');
};
</script>
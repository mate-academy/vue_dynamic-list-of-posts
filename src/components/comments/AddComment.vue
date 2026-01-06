<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  postId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: 'new-comment'
  }
});

const emit = defineEmits(['created', 'cancel']);

const authorName = ref('');
const email = ref('');
const body = ref('');
const isLoading = ref(false);
const error = ref('');

const BASE_URL = 'https://mate.academy/students-api';

const errors = ref({
  name: '',
  email: '',
  body: ''
});

watch(authorName, () => {
  if (errors.value.name) {
    errors.value.name = '';
  }
});
watch(email, () => {
  if (errors.value.email) {
    errors.value.email = '';
  }
});
watch(body, () => {
  if (errors.value.body) {
    errors.value.body = '';
  }
});

function validate() {
  errors.value = {};

  if (!authorName.value.trim()) {
    errors.value.name = 'Name is required';
  }
  if (!email.value.trim()) {
    errors.value.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = 'Email is invalid';
  }
  if (!body.value.trim()) {
    errors.value.body = 'Comment cannot be empty';
  }

  return Object.keys(errors.value).length === 0;
}

async function submitComment() {
  if (!validate()) return;
  isLoading.value = true;
  error.value = '';

  const newComment = {
    postId: props.postId,
    name: authorName.value,
    email: email.value,
    body: body.value
  };

  try {
    const res = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    });
    if (!res.ok) {
      throw new Error('Failed to submit comment');
    }
    const createdComment = await res.json();
    emit('created', createdComment);
    body.value = '';
  } catch (err) {
    console.error(err);
    error.value = 'Failed to submit comment. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function cancelForm() {
  errors.value = { name: '', email: '', body: '' };
  body.value = '';
  emit('cancel');
}
</script>

<template>
  <div class="box mt-3">
    <!-- Name -->
    <div class="field" data-cy="NameField">
      <label class="label" :for="`comment-author-name-${name}`">Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          :id="`comment-author-name-${name}`"
          v-model="authorName"
          placeholder="Your name"
          class="input"
          :class="{ 'is-danger': errors.name }"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span v-if="errors.name" class="icon is-small is-right has-text-danger">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger">{{ errors.name }}</p>
    </div>

    <!-- Email -->
    <div class="field" data-cy="EmailField">
      <label class="label" :for="`comment-email-${name}`">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="email"
          :id="`comment-email-${name}`"
          v-model="email"
          placeholder="Your email"
          class="input"
          :class="{ 'is-danger': errors.email }"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span v-if="errors.email" class="icon is-small is-right has-text-danger">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
    </div>

    <!-- Comment Body -->
    <div class="field" data-cy="BodyField">
      <label class="label" :for="`comment-${name}`">Comment</label>
      <div class="control">
        <textarea
          :id="`comment-${name}`"
          v-model="body"
          placeholder="Write your comment..."
          class="textarea"
          :class="{ 'is-danger': errors.body }"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>

    <!-- Buttons -->
    <div class="buttons mt-3">
      <button type="button" class="button is-primary" :class="{ 'is-loading': isLoading }" @click="submitComment">Submit</button>
      <button type="button" class="button" @click="cancelForm">Cancel</button>
    </div>
  </div>
</template>

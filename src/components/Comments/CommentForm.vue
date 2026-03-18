<script setup>
import { ref, watch } from 'vue';
import BaseInput from '../Base/BaseInput.vue';
import BaseTextArea from '../Base/BaseTextArea.vue';

const props = defineProps({
  postId: { type: Number, required: true },
  isSubmitting: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'submit']);

const name = ref('');
const email = ref('');
const body = ref('');
const errors = ref({ name: '', email: '', body: '' });

watch(name, () => (errors.value.name = ''));
watch(email, () => (errors.value.email = ''));
watch(body, () => (errors.value.body = ''));

const isEmailValid = (val) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
};

const handleSubmit = () => {
  errors.value = { name: '', email: '', body: '' };

  if (!name.value.trim()) {
    errors.value.name = 'Name is required';
  }

  if (!email.value.trim()) {
    errors.value.email = 'Email is required';
  } else if (!isEmailValid(email.value)) {
    errors.value.email = 'Email is not valid';
  }

  if (!body.value.trim()) {
    errors.value.body = 'Comment cannot be empty';
  }

  if (errors.value.name || errors.value.email || errors.value.body) {
    return;
  }

  emit('submit', {
    postId: props.postId,
    name: name.value.trim(),
    email: email.value.trim(),
    body: body.value.trim(),
  });

  body.value = '';
};

const handleClear = () => {
  errors.value = { name: '', email: '', body: '' };
  name.value = '';
  email.value = '';
  body.value = '';
};
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset.prevent="handleClear">
    <BaseInput
      v-model="name"
      title="Author Name"
      name="name"
      placeholder="Name Surname"
      :error-text="errors.name"
    />

    <BaseInput
      v-model="email"
      title="Author Email"
      name="email"
      placeholder="Your Email"
      :error-text="errors.email"
    />

    <BaseTextArea
      v-model="body"
      title="Write Post Body"
      name="body"
      placeholder="Comment"
      :error-text="errors.body"
    />

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light">Clear</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { validateComment } from '../utils/validation.js';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const props = defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
  initialName: {
    type: String,
    default: '',
  },
  initialEmail: {
    type: String,
    default: '',
  },
  successToken: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['submit']);

const form = reactive({
  name: props.initialName,
  email: props.initialEmail,
  body: '',
});
const errors = reactive({});
const submitted = ref(false);

function clearError(field) {
  delete errors[field];
}

function validateAndSubmit() {
  submitted.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  const nextErrors = validateComment(form);
  Object.assign(errors, nextErrors);

  if (Object.keys(nextErrors).length > 0) {
    return;
  }

  emit('submit', {
    name: form.name.trim(),
    email: form.email.trim(),
    body: form.body.trim(),
  });
}

function reset() {
  form.name = '';
  form.email = '';
  form.body = '';
  submitted.value = false;
  Object.keys(errors).forEach(key => delete errors[key]);
}

watch(
  () => props.successToken,
  (nextToken, previousToken) => {
    if (nextToken !== previousToken) {
      form.body = '';
      submitted.value = false;
      Object.keys(errors).forEach(key => delete errors[key]);
    }
  },
);
</script>

<template>
  <form
    class="box mt-4 comment-form"
    data-cy="NewCommentForm"
    novalidate
    @submit.prevent="validateAndSubmit"
    @reset.prevent="reset"
  >
    <h3 class="title is-5">
      Write a comment
    </h3>

    <InputField
      v-model="form.name"
      name="comment-author-name"
      label="Author name"
      placeholder="Your name"
      icon="fa-user"
      data-cy="NameField"
      autocomplete="name"
      :error="submitted ? errors.name : ''"
      @change="clearError('name')"
    />

    <InputField
      v-model="form.email"
      name="comment-author-email"
      label="Email"
      type="email"
      placeholder="you@example.com"
      icon="fa-envelope"
      data-cy="EmailField"
      autocomplete="email"
      :error="submitted ? errors.email : ''"
      @change="clearError('email')"
    />

    <TextAreaField
      v-model="form.body"
      name="comment-body"
      label="Comment"
      placeholder="Write a comment"
      data-cy="BodyField"
      :error="submitted ? errors.body : ''"
      @change="clearError('body')"
    />

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': submitting }"
          :disabled="submitting"
        >
          Add
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" :disabled="submitting">
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

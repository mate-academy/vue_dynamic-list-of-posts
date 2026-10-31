<script setup>
import { reactive, ref, watch } from 'vue';
import { createComment } from '../api';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const props = defineProps({ postId: { type: Number, required: true } });
const emit = defineEmits(['added']);

const name = ref('');
const email = ref('');
const body = ref('');
const errors = reactive({ name: '', email: '', body: '' });
const loading = ref(false);
const submitError = ref('');

watch(name, () => (errors.name = ''));
watch(email, () => (errors.email = ''));
watch(body, () => (errors.body = ''));

function validate() {
  errors.name = name.value.trim() ? '' : 'Name is required';
  errors.email = /^\S+@\S+\.\S+$/.test(email.value.trim())
    ? ''
    : 'Enter a valid email';
  errors.body = body.value.trim() ? '' : 'Enter some text';

  return !errors.name && !errors.email && !errors.body;
}

async function handleSubmit() {
  submitError.value = '';

  if (!validate()) {
    return;
  }

  loading.value = true;

  try {
    const comment = await createComment({
      postId: props.postId,
      name: name.value.trim(),
      email: email.value.trim(),
      body: body.value.trim(),
    });

    emit('added', comment);
    body.value = '';
  } catch {
    submitError.value = 'Could not add the comment. Please try again.';
  } finally {
    loading.value = false;
  }
}

function handleReset() {
  name.value = '';
  email.value = '';
  body.value = '';
  errors.name = errors.email = errors.body = '';
  submitError.value = '';
}
</script>

<template>
  <form
    data-cy="NewCommentForm"
    novalidate
    @submit.prevent="handleSubmit"
    @reset.prevent="handleReset"
  >
    <InputField
      v-model="name"
      label="Author Name"
      name="name"
      placeholder="Name Surname"
      :error="errors.name"
      data-cy="NameField"
    />

    <InputField
      v-model="email"
      label="Author Email"
      name="email"
      type="email"
      placeholder="email@test.com"
      icon="fa-envelope"
      :error="errors.email"
      data-cy="EmailField"
    />

    <TextAreaField
      v-model="body"
      label="Comment Text"
      name="body"
      placeholder="Type comment here"
      :error="errors.body"
      data-cy="BodyField"
    />

    <p v-if="submitError" class="notification is-danger is-light" data-cy="AddCommentError">
      {{ submitError }}
    </p>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': loading }"
        >
          Add
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light">Clear</button>
      </div>
    </div>
  </form>
</template>

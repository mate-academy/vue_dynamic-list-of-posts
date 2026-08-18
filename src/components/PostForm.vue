<script setup>
import { reactive, ref, watch } from 'vue';
import { validatePost } from '../utils/validation.js';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  title: '',
  body: '',
});
const errors = reactive({});
const submitted = ref(false);

function syncForm() {
  form.title = props.post?.title || '';
  form.body = props.post?.body || '';
  submitted.value = false;
  Object.keys(errors).forEach(key => delete errors[key]);
}

watch(() => props.post, syncForm, { immediate: true });

function clearError(field) {
  delete errors[field];
}

function submit() {
  submitted.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  const nextErrors = validatePost(form);
  Object.assign(errors, nextErrors);

  if (Object.keys(nextErrors).length > 0) {
    return;
  }

  emit('submit', {
    title: form.title.trim(),
    body: form.body.trim(),
  });
}

function cancel() {
  syncForm();
  emit('cancel');
}
</script>

<template>
  <div class="content" data-cy="PostForm">
    <h2 class="title is-4">
      {{ post ? 'Edit post' : 'Create a new post' }}
    </h2>

    <form novalidate @submit.prevent="submit" @reset.prevent="cancel">
      <InputField
        v-model="form.title"
        name="post-title"
        label="Title"
        placeholder="Post title"
        icon="fa-heading"
        data-cy="TitleField"
        :error="submitted ? errors.title : ''"
        @change="clearError('title')"
      />

      <TextAreaField
        v-model="form.body"
        name="post-body"
        label="Body"
        placeholder="Write your post"
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
            {{ post ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" :disabled="submitting">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

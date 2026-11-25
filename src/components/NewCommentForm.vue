<script setup lang="ts">
import { ref } from 'vue';
import type { Comment, CommentData } from '@/types/Comment';
import { client } from '@/api/fetchClient';

interface Props {
  postId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{ added: [comment: Comment] }>();

const formData = ref<CommentData>({ name: '', email: '', body: '' });
const errors = ref<Partial<CommentData>>({});
const submitted = ref(false);
const loading = ref(false);
const submitError = ref(false);

function validate(): boolean {
  const newErrors: Partial<CommentData> = {};

  if (!formData.value.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!formData.value.email.trim()) {
    newErrors.email = 'Email is required';
  }

  if (!formData.value.body.trim()) {
    newErrors.body = 'Enter some text';
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

function handleChange(field: keyof CommentData, value: string): void {
  formData.value[field] = value;

  if (submitted.value && errors.value[field]) {
    errors.value = { ...errors.value, [field]: undefined };
  }

  if (submitError.value) {
    submitError.value = false;
  }
}

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault();
  if (loading.value) return;
  submitted.value = true;
  submitError.value = false;

  if (!validate()) {
    return;
  }

  loading.value = true;
  try {
    const response = await client.post<Comment>('/comments', {
      ...formData.value,
      postId: props.postId,
    });

    emit('added', response);
    formData.value = { ...formData.value, body: '' };
    submitted.value = false;
  } catch {
    submitError.value = true;
  } finally {
    loading.value = false;
  }
}

function handleClear(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  formData.value = { ...formData.value, body: '' };
  errors.value = {};
  submitted.value = false;
  submitError.value = false;
}
</script>

<template>
  <form data-cy="NewCommentForm" @submit="handleSubmit">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name">Author Name</label>

      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="name"
          id="comment-author-name"
          placeholder="Name Surname"
          class="input"
          :class="{ 'is-danger': submitted && errors.name }"
          :value="formData.name"
          @input="handleChange('name', ($event.target as HTMLInputElement).value)"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-user" />
        </span>

        <span
          v-if="submitted && errors.name"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle" />
        </span>
      </div>

      <p v-if="submitted && errors.name" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.name }}
      </p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" for="comment-author-email">Author Email</label>

      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="email"
          id="comment-author-email"
          placeholder="email@test.com"
          class="input"
          :class="{ 'is-danger': submitted && errors.email }"
          :value="formData.email"
          @input="handleChange('email', ($event.target as HTMLInputElement).value)"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>

        <span
          v-if="submitted && errors.email"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle" />
        </span>
      </div>

      <p v-if="submitted && errors.email" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.email }}
      </p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Comment Text</label>

      <div class="control">
        <textarea
          id="comment-body"
          name="body"
          placeholder="Type comment here"
          class="textarea"
          :class="{ 'is-danger': submitted && errors.body }"
          :value="formData.body"
          @input="handleChange('body', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>

      <p v-if="submitted && errors.body" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.body }}
      </p>
    </div>

    <p v-if="submitError" class="help is-danger" data-cy="AddCommentError">
      Unable to add a comment
    </p>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': loading }">
          Add
        </button>
      </div>

      <div class="control">
        <button type="button" class="button is-link is-light" @click="handleClear">
          Clear
        </button>
      </div>
    </div>
  </form>
</template>
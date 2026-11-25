<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Post } from '@/types/Post';
import { client } from '@/api/fetchClient';

interface Props {
  post?: Post;
  userId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  save: [post: Post];
  cancel: [];
}>();

const isEditing = computed(() => !!props.post);

const title = ref('');
const body = ref('');
const titleError = ref<string | null>(null);
const bodyError = ref<string | null>(null);
const loading = ref(false);
const submitError = ref<string | null>(null);
const submitted = ref(false);

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      title.value = newPost.title;
      body.value = newPost.body;
      titleError.value = null;
      bodyError.value = null;
      submitError.value = null;
      submitted.value = false;
    } else {
      title.value = '';
      body.value = '';
      titleError.value = null;
      bodyError.value = null;
      submitError.value = null;
      submitted.value = false;
    }
  },
  { immediate: true }
);

function validate(): boolean {
  let valid = true;
  if (!title.value.trim()) {
    titleError.value = 'Title is required';
    valid = false;
  }
  if (!body.value.trim()) {
    bodyError.value = 'Body is required';
    valid = false;
  }
  return valid;
}

function handleTitleInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  title.value = target.value;
  if (submitted.value && titleError.value) titleError.value = null;
  if (submitError.value) submitError.value = null;
}

function handleBodyInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement;
  body.value = target.value;
  if (submitted.value && bodyError.value) bodyError.value = null;
  if (submitError.value) submitError.value = null;
}

async function handleSubmit(event: Event): Promise<void> {
  event.preventDefault();
  if (loading.value) return;
  submitted.value = true;
  submitError.value = null;

  if (!validate()) return;

  loading.value = true;
  try {
    let savedPost: Post;
    if (isEditing.value && props.post) {
      savedPost = await client.patch<Post>(`/posts/${props.post.id}`, {
        title: title.value.trim(),
        body: body.value.trim(),
      });
    } else {
      savedPost = await client.post<Post>('/posts', {
        userId: props.userId,
        title: title.value.trim(),
        body: body.value.trim(),
      });
    }
    emit('save', savedPost);
  } catch {
    submitError.value = isEditing.value ? 'Unable to update post' : 'Unable to create post';
  } finally {
    loading.value = false;
  }
}

function handleCancel(): void {
  emit('cancel');
}
</script>

<template>
  <div class="content">
    <h2>{{ isEditing ? 'Edit Post' : 'New Post' }}</h2>
    <form @submit="handleSubmit">
      <div class="field" data-cy="TitleField">
        <label class="label" for="post-title">Title</label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            id="post-title"
            name="title"
            class="input"
            :class="{ 'is-danger': submitted && titleError }"
            placeholder="Post title"
            :value="title"
            @input="handleTitleInput"
            :disabled="loading"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-heading" />
          </span>
          <span v-if="submitted && titleError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
            <i class="fas fa-exclamation-triangle" />
          </span>
        </div>
        <p v-if="submitted && titleError" class="help is-danger" data-cy="ErrorMessage">{{ titleError }}</p>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="post-body">Body</label>
        <div class="control">
          <textarea
            id="post-body"
            name="body"
            class="textarea"
            :class="{ 'is-danger': submitted && bodyError }"
            placeholder="Post body"
            :value="body"
            @input="handleBodyInput"
            :disabled="loading"
          />
        </div>
        <p v-if="submitted && bodyError" class="help is-danger" data-cy="ErrorMessage">{{ bodyError }}</p>
      </div>

      <p v-if="submitError" class="help is-danger" data-cy="PostSubmitError">{{ submitError }}</p>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link" :class="{ 'is-loading': loading }" :disabled="loading">
            {{ isEditing ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button type="button" class="button is-link is-light" @click="handleCancel" :disabled="loading">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
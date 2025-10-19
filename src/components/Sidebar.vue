<template>
  <section class="section">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h2 class="title is-4">
            {{ isCreating ? 'Create New Post' : editMode ? 'Edit Post' : 'Post Details' }}
          </h2>
        </div>
        <div class="level-right">
          <button class="delete" @click="$emit('close')"></button>
        </div>
      </div>

      <form v-if="isCreating" @submit.prevent="createPost">
        <PostForm
          :form="form"
          :errors="errors"
          :isSubmitting="isSubmitting"
          :submitError="submitError"
          @submit="createPost"
          @clear="clearForm"
        />
      </form>

      <form v-else-if="editMode" @submit.prevent="savePost">
        <PostForm
          :form="form"
          :errors="errors"
          :isSubmitting="isSubmitting"
          :submitError="submitError"
          @submit="savePost"
          @clear="cancelEdit"
          save-label="Save"
        />
      </form>

      <div v-else-if="selectedPost">
        <h3 class="subtitle">{{ selectedPost.title }}</h3>
        <p>{{ selectedPost.body }}</p>

        <div class="buttons mt-4">
          <button class="button is-info is-light" @click="startEdit">
            Edit
          </button>
          <button class="button is-danger is-light" @click="deletePost">
            Delete
          </button>
        </div>

        <hr />
        <p><em>Comments section will go here 👇</em></p>
      </div>

      <div v-else>
        <p>Select a post to see its details.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import { post, remove } from '../api/api';
import PostForm from './forms/PostForm.vue';

const props = defineProps({
  selectedPost: Object,
  isCreating: Boolean,
});

const emit = defineEmits(['close', 'postCreated', 'postUpdated', 'postDeleted']);

const form = ref({ title: '', body: '' });
const errors = ref({});
const isSubmitting = ref(false);
const submitError = ref(false);
const editMode = ref(false);

watch(
  () => props.selectedPost,
  (newPost) => {
    if (newPost && !props.isCreating) {
      form.value.title = newPost.title;
      form.value.body = newPost.body;
    }
  },
  { immediate: true }
);

function validateForm() {
  errors.value = {};
  if (!form.value.title.trim()) errors.value.title = 'Title is required';
  if (!form.value.body.trim()) errors.value.body = 'Body is required';
  return Object.keys(errors.value).length === 0;
}

function clearForm() {
  form.value.title = '';
  form.value.body = '';
  errors.value = {};
  submitError.value = false;
}

function cancelEdit() {
  editMode.value = false;
  submitError.value = false;
  errors.value = {};
}

function startEdit() {
  editMode.value = true;
}

async function createPost() {
  if (!validateForm()) return;
  isSubmitting.value = true;
  submitError.value = false;

  try {
    const newPost = await post('/posts', {
      title: form.value.title,
      body: form.value.body,
      userId: 1,
    });
    emit('postCreated', newPost);
    clearForm();
  } catch {
    submitError.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

async function savePost() {
  if (!validateForm()) return;
  isSubmitting.value = true;
  submitError.value = false;

  try {
    const updated = {
      ...props.selectedPost,
      title: form.value.title,
      body: form.value.body,
    };
    emit('postUpdated', updated);
    editMode.value = false;
  } catch {
    submitError.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

async function deletePost() {
  try {
    await remove(`/posts/${props.selectedPost.id}`);
    emit('postDeleted', props.selectedPost.id);
    emit('close');
  } catch {
    alert('Failed to delete post. Please retry.');
  }
}
</script>

<style scoped>
.delete {
  cursor: pointer;
}
</style>

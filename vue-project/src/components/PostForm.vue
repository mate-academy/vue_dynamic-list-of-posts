<template>
  <div class="content">
    <h2>{{ isEditing ? 'Edit Post' : 'Create Post' }}</h2>
    <form @submit.prevent="submit">
      <div class="field">
        <label class="label" for="post-title">Title</label>
        <div class="control">
          <input
            id="post-title"
            v-model="form.title"
            class="input"
            :class="{ 'is-danger': errors.title }"
            type="text"
            placeholder="Enter post title"
            required
          />
        </div>
        <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
      </div>
      <div class="field">
        <label class="label" for="post-body">Body</label>
        <div class="control">
          <textarea
            id="post-body"
            v-model="form.body"
            class="textarea"
            :class="{ 'is-danger': errors.body }"
            placeholder="Enter post body"
            required
          ></textarea>
        </div>
        <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button type="button" class="button is-link is-light" @click="cancel">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['post']);
const emit = defineEmits(['save', 'cancel']);

const form = ref({
  title: '',
  body: '',
});
const errors = ref({});
const isSubmitting = ref(false);

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      form.value = { title: newPost.title, body: newPost.body };
    } else {
      form.value = { title: '', body: '' };
    }
    errors.value = {};
  },
  { immediate: true }
);

const validate = () => {
  errors.value = {};
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required';
  }
  if (!form.value.body.trim()) {
    errors.value.body = 'Body is required';
  }
  return Object.keys(errors.value).length === 0;
};

const submit = async () => {
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    emit('save', { ...form.value });
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  emit('cancel');
};
</script>
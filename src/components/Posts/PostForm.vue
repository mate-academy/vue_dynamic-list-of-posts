<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  userId: { type: Number, required: true },
  post: { type: Object, default: null },
});

const emit = defineEmits(['save', 'cancel']);

const title = ref(props.post?.title || '');
const body = ref(props.post?.body || '');
const isSubmitting = ref(false);
const errors = ref({ title: '', body: '' });

watch(title, () => (errors.value.title = ''));
watch(body, () => (errors.value.body = ''));

const handleSubmit = () => {
  errors.value = { title: '', body: '' };

  if (!title.value.trim()) errors.value.title = 'Title is required';
  if (!body.value.trim()) errors.value.body = 'Content is required';

  if (errors.value.title || errors.value.body) return;

  isSubmitting.value = true;

  const postData = {
    userId: props.userId,
    title: title.value,
    body: body.value,
  };

  if (props.post) {
    postData.id = props.post.id;
  }

  emit('save', postData);
};
</script>

<template>
  <div class="content">
    <h2 class="title is-4">{{ post ? 'Edit post' : 'Create new post' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-model="title"
            class="input"
            :class="{ 'is-danger': errors.title }"
            type="text"
            placeholder="Enter post title"
          />
        </div>
        <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
      </div>

      <div class="field">
        <label class="label">Write Post Body</label>
        <div class="control">
          <textarea
            v-model="body"
            class="textarea"
            :class="{ 'is-danger': errors.body }"
            placeholder="Enter post content"
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
            {{ post ? 'Save changes' : 'Save' }}
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

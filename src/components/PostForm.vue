<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['save', 'cancel']);

const title = ref(props.post?.title || '');
const body = ref(props.post?.body || '');

watch(() => props.post, (newPost) => {
  title.value = newPost?.title || '';
  body.value = newPost?.body || '';
});

const handleSubmit = () => {
  emit('save', { title: title.value, body: body.value });
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="content">
    <h2>{{ post ? 'Edit Post' : 'Create New Post' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label" for="post-title">Title</label>
        <div class="control">
          <input
            type="text"
            id="post-title"
            class="input"
            placeholder="Enter post title"
            required
            v-model="title"
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="post-body">Body</label>
        <div class="control">
          <textarea
            id="post-body"
            class="textarea"
            placeholder="Enter post body"
            required
            v-model="body"
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="handleCancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

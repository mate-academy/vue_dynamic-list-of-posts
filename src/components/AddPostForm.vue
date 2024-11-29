<script setup>
import { ref, watch } from 'vue';
import * as postsApi from '@/api/posts';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { getUserId } from '@/utils/user';

const emit = defineEmits(['postAdded', 'closeSidebar']);

const props = defineProps({
  post: {
    type: Object,
  },
});

const title = ref('');
const content = ref('');
const error = ref('');
const errorTitle = ref('');
const errorBody = ref('');
const userId = getUserId();

watch(
  () => props.post,
  newPost => {
    if (newPost) {
      title.value = newPost.title;
      content.value = newPost.body;
    } else {
      title.value = '';
      content.value = '';
    }
  },
  { immediate: true },
);

watch(title, newTitle => {
  if (newTitle) {
    errorTitle.value = '';
  }
});

watch(content, newContent => {
  if (newContent) {
    errorBody.value = '';
  }
});

const handleSubmit = async () => {
  if (!title.value) {
    errorTitle.value = 'Field is required';
  }

  if (!content.value) {
    errorBody.value = 'Field is required';
  }

  if (!title.value || !content.value) {
    return;
  }

  const updatedPost = {
    title: title.value,
    body: content.value,
  };

  let postToShow;

  try {
    if (props.post && props.post.id) {
      postToShow = await postsApi.editPost(props.post.id, updatedPost);
    } else {
      postToShow = await postsApi.addPost({
        userId: userId,
        title: title.value,
        body: content.value,
      });
    }

    emit('postAdded', postToShow);

    title.value = '';
    content.value = '';
    errorTitle.value = '';
    errorBody.value = '';
    error.value = '';
  } catch (err) {
    error.value = 'Failed to create post. Please try again.';
  }
};
</script>

<template>
  <div class="content">
    <h2>{{ props.post ? 'Post editing' : 'Create new post' }}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model.trim="title"
        title="Title"
        :error-message="errorTitle"
        name="title"
        placeholder="Post title"
      />

      <TextAreaField
        v-model="content"
        title="Write Post Body"
        :error-message="errorBody"
        name="body"
        placeholder="Post body"
      />

      <div v-if="error" class="has-text-danger">
        <p>{{ error }}</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ props.post ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="emit('closeSidebar')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { usePostStore } from '../../stores/postsStore';

const postStore = usePostStore();

onMounted(() => {
  if (postStore.editingPost) {
    postStore.newPost.title = postStore.editingPost.title;
    postStore.newPost.body = postStore.editingPost.body;
  }
});

watch(
  () => postStore.editingPost,
  newValue => {
    if (newValue) {
      postStore.newPost.title = newValue.title;
      postStore.newPost.body = newValue.body;
    }
  }
);

async function handleSubmit() {
  let hasError = false;

  if (!postStore.newPost.title.trim()) {
    postStore.errorMessages.title = 'Title is required';
    hasError = true;
  }

  if (!postStore.newPost.body.trim()) {
    postStore.errorMessages.body = 'Body is required';
    hasError = true;
  }

  if (hasError) {
    return;
  }
  try {
    await postStore.savePost(!postStore.editingPost);
  } catch (err) {
    postStore.errorMessages.fetch = 'Error adding post: ' + err.message;
  }
}

function clearTitleError() {
  if (postStore.newPost.title.trim()) {
    postStore.errorMessages.title = null;
  }
}

function clearBodyError() {
  if (postStore.newPost.body.trim()) {
    postStore.errorMessages.body = null;
  }
}
</script>
<template>
  <div class="content">
    <h2>{{ postStore.editingPost ? 'Edit Post' : 'Create New Post' }}</h2>

    <form @submit.prevent="handleSubmit()">
      <div class="field" data-cy="NameField">
        <InputField
          :label="`Title`"
          :input-id="'postTitle'"
          :placeholder="'Post title'"
          :error-message="postStore.errorMessages.title"
          v-model="postStore.newPost.title"
          @input="clearTitleError"
        />
      </div>
      <div class="field" data-cy="NameField">
        <TextAreaField
          :label="`Write post body`"
          :input-id="'postBody'"
          :placeholder="'Post body'"
          :error-message="postStore.errorMessages.body"
          v-model="postStore.newPost.body"
          @input="clearBodyError"
        />
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ postStore.editingPost ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="postStore.toggleAddPostBtn()"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

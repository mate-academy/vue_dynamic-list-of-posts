<script setup>
import { ref } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const title = ref('');
const body = ref('');
const titleError = ref('');
const bodyError = ref('');

const submit = () => {
  titleError.value = '';
  bodyError.value = '';

  if (!title.value.trim()) {
    titleError.value = 'Title is required';
  }

  if (!body.value.trim()) {
    bodyError.value = 'Body is required';
  }

  if (titleError.value || bodyError.value) {
    return;
  }

  emit('submit', {
    title: title.value.trim(),
    body: body.value.trim(),
  });

  title.value = '';
  body.value = '';
};
</script>

<template>
  <div class="content">
    <h2>
      {{ post ? 'Edit post' : 'Create new post' }}
    </h2>

    <form @submit.prevent="submit">
      <div class="field">
        <label
          class="label"
          for="post-title"
        >
          Title
        </label>

        <div class="control">
          <input
            id="post-title"
            v-model="title"
            class="input"
            :class="{ 'is-danger': titleError }"
            type="text"
            placeholder="Post title"
            @input="titleError = ''"
          />
        </div>

        <p
          v-if="titleError"
          class="help is-danger"
        >
          {{ titleError }}
        </p>
      </div>

      <div class="field">
        <label
          class="label"
          for="post-body"
        >
          Body
        </label>

        <div class="control">
          <textarea
            id="post-body"
            v-model="body"
            class="textarea"
            :class="{ 'is-danger': bodyError }"
            placeholder="Post body"
            @input="bodyError = ''"
          ></textarea>
        </div>

        <p
          v-if="bodyError"
          class="help is-danger"
        >
          {{ bodyError }}
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
          >
            Save
          </button>
        </div>

        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click.prevent="emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
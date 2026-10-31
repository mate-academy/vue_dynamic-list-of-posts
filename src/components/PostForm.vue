<script setup>
import { reactive, ref, watch } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const props = defineProps({
  post: { type: Object, default: null },
  saving: Boolean,
  error: { type: String, default: '' },
});

const emit = defineEmits(['submit', 'cancel']);

const title = ref(props.post?.title ?? '');
const body = ref(props.post?.body ?? '');
const errors = reactive({ title: '', body: '' });

watch(title, () => (errors.title = ''));
watch(body, () => (errors.body = ''));

function handleSubmit() {
  errors.title = title.value.trim() ? '' : 'Title is required';
  errors.body = body.value.trim() ? '' : 'Post text is required';

  if (errors.title || errors.body) {
    return;
  }

  emit('submit', { title: title.value.trim(), body: body.value.trim() });
}
</script>

<template>
  <div class="content" data-cy="PostForm">
    <h2>{{ post ? `Edit post #${post.id}` : 'Create a new post' }}</h2>

    <form novalidate @submit.prevent="handleSubmit" @reset.prevent="$emit('cancel')">
      <InputField
        v-model="title"
        label="Title"
        name="title"
        placeholder="Post title"
        icon="fa-heading"
        :error="errors.title"
        data-cy="TitleField"
      />

      <TextAreaField
        v-model="body"
        label="Text"
        name="body"
        placeholder="Write your post"
        :error="errors.body"
        data-cy="BodyField"
      />

      <p v-if="error" class="notification is-danger is-light" data-cy="PostSaveError">
        {{ error }}
      </p>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': saving }"
          >
            {{ post ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

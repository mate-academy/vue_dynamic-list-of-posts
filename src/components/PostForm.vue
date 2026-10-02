<script setup>
import { reactive } from 'vue';

const props = defineProps({ post: Object, pending: Boolean, error: String });
const emit = defineEmits(['submit', 'cancel']);
const fields = reactive({ title: props.post?.title || '', body: props.post?.body || '' });
const errors = reactive({ title: '', body: '' });

function submit() {
  if (props.pending) return;
  errors.title = fields.title.trim() ? '' : 'Title is required';
  errors.body = fields.body.trim() ? '' : 'Body is required';
  if (!errors.title && !errors.body) {
    emit('submit', { title: fields.title.trim(), body: fields.body.trim() });
  }
}
</script>

<template>
  <form novalidate data-cy="PostForm" @submit.prevent="submit">
    <h2 class="title is-4">{{ post ? 'Edit post' : 'Create new post' }}</h2>
    <div class="field" data-cy="TitleField">
      <label class="label" for="post-title">Title</label>
      <input id="post-title" v-model="fields.title" class="input" :class="{ 'is-danger': errors.title }" :disabled="pending" @input="errors.title = ''" />
      <p v-if="errors.title" class="help is-danger" data-cy="ErrorMessage">{{ errors.title }}</p>
    </div>
    <div class="field" data-cy="BodyField">
      <label class="label" for="post-body">Body</label>
      <textarea id="post-body" v-model="fields.body" class="textarea" :class="{ 'is-danger': errors.body }" :disabled="pending" @input="errors.body = ''"></textarea>
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">{{ errors.body }}</p>
    </div>
    <p v-if="error" class="notification is-danger" role="alert">{{ error }}</p>
    <div class="field is-grouped">
      <div class="control"><button class="button is-link" :class="{ 'is-loading': pending }" :disabled="pending">{{ post ? 'Save' : 'Create' }}</button></div>
      <div class="control"><button type="button" class="button is-link is-light" :disabled="pending" @click="emit('cancel')">Cancel</button></div>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';
const props = defineProps({ post: { type: Object, default: null }, busy: Boolean, error: { type: String, default: '' } });
const emit = defineEmits(['save', 'cancel']);
const form = reactive({ title: props.post?.title || '', body: props.post?.body || '' });
const errors = reactive({ title: '', body: '' });
function submit() {
  if (props.busy) return;
  errors.title = form.title.trim() ? '' : 'Title is required';
  errors.body = form.body.trim() ? '' : 'Body is required';
  if (!errors.title && !errors.body) emit('save', { title: form.title.trim(), body: form.body.trim() });
}
</script>
<template>
  <div class="content">
    <h2>{{ post ? 'Edit post' : 'Create new post' }}</h2>
    <form novalidate @submit.prevent="submit">
      <fieldset :disabled="busy">
        <div class="field" data-cy="TitleField">
          <label class="label" for="post-title">Title</label>
          <input id="post-title" v-model="form.title" name="title" class="input" :class="{ 'is-danger': errors.title }" :aria-invalid="!!errors.title" placeholder="Post title" @input="errors.title = ''">
          <p v-if="errors.title" class="help is-danger" data-cy="ErrorMessage">{{ errors.title }}</p>
        </div>
        <div class="field" data-cy="BodyField">
          <label class="label" for="post-body">Body</label>
          <textarea id="post-body" v-model="form.body" name="body" class="textarea" :class="{ 'is-danger': errors.body }" :aria-invalid="!!errors.body" placeholder="Post body" @input="errors.body = ''"></textarea>
          <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">{{ errors.body }}</p>
        </div>
        <p v-if="error" class="notification is-danger" role="alert">{{ error }}</p>
        <div class="field is-grouped">
          <div class="control"><button type="submit" class="button is-link" :class="{ 'is-loading': busy }">{{ post ? 'Save' : 'Create' }}</button></div>
          <div class="control"><button type="button" class="button is-link is-light" @click="emit('cancel')">Cancel</button></div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

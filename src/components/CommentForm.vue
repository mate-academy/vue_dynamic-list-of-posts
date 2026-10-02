<script setup>
import { reactive } from 'vue';
import { request } from '../api';

const props = defineProps({ postId: { type: Number, required: true } });
const emit = defineEmits(['added']);
const state = reactive({ name: '', email: '', body: '', pending: false, error: '' });
const errors = reactive({ name: '', email: '', body: '' });

function clear() {
  state.name = ''; state.email = ''; state.body = ''; state.error = '';
  Object.keys(errors).forEach(key => { errors[key] = ''; });
}

async function submit() {
  if (state.pending) return;
  errors.name = state.name.trim() ? '' : 'Name is required';
  errors.email = !state.email.trim() ? 'Email is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim()) ? '' : 'Enter a valid email';
  errors.body = state.body.trim() ? '' : 'Comment text is required';
  state.error = '';
  if (Object.values(errors).some(Boolean)) return;
  state.pending = true;
  try {
    const comment = await request('/comments', 'POST', {
      postId: props.postId, name: state.name.trim(), email: state.email.trim(), body: state.body.trim(),
    });
    emit('added', comment);
    state.body = '';
  } catch {
    state.error = 'Unable to add a comment. Please try again.';
  } finally {
    state.pending = false;
  }
}
</script>

<template>
  <form novalidate data-cy="NewCommentForm" @submit.prevent="submit">
    <div v-for="field in ['name', 'email', 'body']" :key="field" class="field" :data-cy="`${field[0].toUpperCase() + field.slice(1)}Field`">
      <label class="label" :for="`comment-${field}`">{{ field === 'body' ? 'Comment' : field === 'name' ? "Author's name" : "Author's email" }}</label>
      <div class="control">
        <textarea v-if="field === 'body'" :id="`comment-${field}`" v-model="state[field]" class="textarea" :class="{ 'is-danger': errors[field] }" :disabled="state.pending" @input="errors[field] = ''"></textarea>
        <input v-else :id="`comment-${field}`" v-model="state[field]" :type="field === 'email' ? 'email' : 'text'" class="input" :class="{ 'is-danger': errors[field] }" :disabled="state.pending" @input="errors[field] = ''" />
      </div>
      <p v-if="errors[field]" class="help is-danger" data-cy="ErrorMessage">{{ errors[field] }}</p>
    </div>
    <p v-if="state.error" class="notification is-danger" role="alert">{{ state.error }}</p>
    <div class="field is-grouped">
      <div class="control"><button class="button is-link" :class="{ 'is-loading': state.pending }" :disabled="state.pending">Add comment</button></div>
      <div class="control"><button type="button" class="button is-link is-light" :disabled="state.pending" @click="clear">Clear</button></div>
    </div>
  </form>
</template>

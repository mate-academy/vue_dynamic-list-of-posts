<template>
  <div class="block">
    <h5 class="title is-6">Add Comment</h5>

    <input
      class="input mb-1"
      placeholder="Name"
      v-model="form.name"
    />
    <p v-if="errors.name" class="help is-danger">{{ errors.name }}</p>

    <input
      class="input mb-1"
      placeholder="Email"
      v-model="form.email"
    />
    <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>

    <textarea
      class="textarea mb-1"
      placeholder="Comment"
      v-model="form.body"
    ></textarea>
    <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>

    <div class="buttons">
      <button class="button is-success" :disabled="isLoading" @click="submit">
        Add
      </button>
      <button class="button" :disabled="isLoading" @click="clearBody">Clear</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { fetchClient } from '../utils/fetchClient';
import { Comment } from '../types/Post';

export default defineComponent({
  props: { postId: { type: Number, required: true } },
  emits: ['comment-added'],
  setup(props, { emit }) {
    const form = reactive({ name: '', email: '', body: '' });
    const errors = reactive({ name: '', email: '', body: '' });
    const isLoading = ref(false);

    const validate = () => {
      let valid = true;
      errors.name = form.name.trim() ? '' : 'Name is required';
      errors.email = form.email.trim() ? '' : 'Email is required';
      errors.body = form.body.trim() ? '' : 'Comment body is required';
      if (errors.name || errors.email || errors.body) valid = false;
      return valid;
    };

    const submit = async () => {
      if (!validate()) return;
      isLoading.value = true;
      try {
        const created: Comment = await fetchClient.post(`/comments`, { ...form, postId: props.postId });
        emit('comment-added', created);
        form.body = '';
      } catch {
        console.error('Failed to add comment');
      } finally {
        isLoading.value = false;
      }
    };

    const clearBody = () => { form.body = ''; errors.body = ''; };

    return { form, errors, isLoading, submit, clearBody };
  }
});
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          v-model="form.name"
          class="input"
          type="text"
          placeholder="Your name"
          @input="errors.name = ''"
        />
      </div>
      <p v-if="errors.name" class="help is-danger">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input
          v-model="form.email"
          class="input"
          type="email"
          placeholder="Your email"
          @input="errors.email = ''"
        />
      </div>
      <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label class="label">Comment</label>
      <div class="control">
        <textarea
          v-model="form.body"
          class="textarea"
          placeholder="Write your comment..."
          @input="errors.body = ''"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>

    <div class="field is-grouped is-grouped-right">
      <div class="control">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isSubmitting }"
        >
          Submit
        </button>
      </div>
      <div class="control">
        <button type="button" class="button" @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { post } from '../../api/api';

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  name: '',
  email: '',
  body: '',
});

const errors = ref({});
const isSubmitting = ref(false);

function validate() {
  errors.value = {};
  if (!form.value.name.trim()) errors.value.name = 'Name is required';
  if (!form.value.email.trim()) errors.value.email = 'Email is required';
  if (!form.value.body.trim()) errors.value.body = 'Comment text is required';
  return Object.keys(errors.value).length === 0;
}

async function submitForm() {
  if (!validate()) return;
  isSubmitting.value = true;

  try {
    const newComment = await post('/comments', { ...form.value });
    emit('submit', newComment);
    form.value.body = '';
  } catch {
    alert('Failed to add comment.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

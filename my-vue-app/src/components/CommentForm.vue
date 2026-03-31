<script setup>
import { ref } from 'vue';

const props = defineProps(['postId']);
const emit = defineEmits(['added', 'cancel']);

const commentName = ref('');
const commentEmail = ref('');
const commentBody = ref('');
const errors = ref({ name: false, email: false, body: false });
const hasSubmitted = ref(false);
const isSubmitting = ref(false);
const hasSubmitError = ref(false); // Do obsługi błędu wysyłania

const validateForm = () => {
  errors.value.name = !commentName.value.trim();
  errors.value.email = !commentEmail.value.trim();
  errors.value.body = !commentBody.value.trim();
  return !errors.value.name && !errors.value.email && !errors.value.body;
};

const handleInput = (field) => {
  if (hasSubmitted.value) errors.value[field] = false;
};

// Funkcja Clear (wymóg mentora)
const clearForm = () => {
  commentName.value = '';
  commentEmail.value = '';
  commentBody.value = '';
  errors.value = { name: false, email: false, body: false };
  hasSubmitted.value = false;
  hasSubmitError.value = false;
};

const saveComment = async () => {
  hasSubmitted.value = true;
  if (!validateForm()) return;

  isSubmitting.value = true;
  hasSubmitError.value = false; // reset bledu

  try {
    const response = await fetch('https://mate.academy/students-api/comments', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        postId: props.postId,
        name: commentName.value,
        email: commentEmail.value,
        body: commentBody.value
      })
    });
    if (!response.ok) throw new Error();
    const newComment = await response.json();

    emit('added', newComment);

    commentBody.value = '';
    errors.value.body = false;
    hasSubmitted.value = false;
  } catch {
    hasSubmitError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="saveComment" class="mt-4">

    <div v-if="hasSubmitError" class="notification is-danger is-light p-2 mb-3 is-size-7">
      Failed to post comment.
      <button type="button" class="button is-small is-danger ml-2" @click="saveComment">Retry</button>
    </div>

    <div class="field">
      <label class="label is-small">Author Name</label>
      <div class="control has-icons-left">
        <input v-model="commentName" class="input is-small custom-field" :class="{'is-danger': errors.name}" type="text" placeholder="Name Surname" @input="handleInput('name')" />
        <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
      </div>
      <p v-if="errors.name" class="help is-danger">Name is required</p>
    </div>

    <div class="field">
      <label class="label is-small">Author Email</label>
      <div class="control has-icons-left">
        <input v-model="commentEmail" class="input is-small custom-field" :class="{'is-danger': errors.email}" type="email" placeholder="Your Email" @input="handleInput('email')" />
        <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
      </div>
      <p v-if="errors.email" class="help is-danger">Email is required</p>
    </div>

    <div class="field">
      <label class="label is-small">Write Comment Body</label>
      <div class="control">
        <textarea v-model="commentBody" class="textarea is-small custom-field" :class="{'is-danger': errors.body}" placeholder="Comment" @input="handleInput('body')"></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">Comment text is required</p>
    </div>

    <div class="buttons">
      <button type="submit" class="button is-link is-small" :class="{'is-loading': isSubmitting}">Add Comment</button>

      <button type="button" class="button is-light is-small" @click="clearForm">Clear</button>

      <button type="button" class="button is-white is-small" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

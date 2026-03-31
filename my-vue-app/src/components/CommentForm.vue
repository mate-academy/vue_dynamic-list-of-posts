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

const validateForm = () => {
  errors.value.name = !commentName.value.trim();
  errors.value.email = !commentEmail.value.trim();
  errors.value.body = !commentBody.value.trim();
  return !errors.value.name && !errors.value.email && !errors.value.body;
};

const handleInput = (field) => {
  if (hasSubmitted.value) errors.value[field] = false;
};

const saveComment = async () => {
  hasSubmitted.value = true;
  if (!validateForm()) return;

  isSubmitting.value = true;
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

    // TYLKO czyścimy body i resetujemy błędy po sukcesie. Formularz nie emituje 'cancel', więc zostaje otwarty!
    commentBody.value = '';
    errors.value.body = false;
    hasSubmitted.value = false;
  } catch {
    alert('Failed to post comment.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="saveComment" class="mt-4">
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
      <button type="button" class="button is-white is-small" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

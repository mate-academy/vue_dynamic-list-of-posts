<script setup>
import { ref } from 'vue';
import BaseInput from '../Base/BaseInput.vue';
import BaseTextArea from '../Base/BaseTextArea.vue';

const props = defineProps({
  postId: { type: Number, required: true },
});

const emit = defineEmits(['close', 'submit']);

const name = ref('');
const email = ref('');
const body = ref('');

const errors = ref({
  name: '',
  email: '',
  body: '',
});

const handleSubmit = () => {
  errors.value = { name: '', email: '', body: '' };

  if (!name.value) errors.value.name = 'Name is required';
  if (!email.value) errors.value.email = 'Email is required';
  if (!body.value) errors.value.body = 'Comment cannot be empty';

  if (errors.value.name || errors.value.email || errors.value.body) return;

  emit('submit', {
    postId: props.postId,
    name: name.value,
    email: email.value,
    body: body.value,
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <BaseInput
      v-model="name"
      title="Author Name"
      name="name"
      placeholder="Name Surname"
      :error-text="errors.name"
    />

    <BaseInput
      v-model="email"
      title="Author Email"
      name="email"
      placeholder="Your Email"
      :error-text="errors.email"
    />

    <BaseTextArea
      v-model="body"
      title="Write Post Body"
      name="body"
      placeholder="Comment"
      :error-text="errors.body"
    />

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Add Comment</button>
      </div>
      <div class="control">
        <button
          type="reset"
          class="button is-link is-light"
          @click="emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

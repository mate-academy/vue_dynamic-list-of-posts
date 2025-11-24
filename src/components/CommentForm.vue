<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  savedName: {
    type: String,
    default: '',
  },
  savedEmail: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['submit', 'cancel']);

const name = ref(props.savedName);
const email = ref(props.savedEmail);
const body = ref('');

watch(() => props.savedName, (newName) => {
  name.value = newName;
});

watch(() => props.savedEmail, (newEmail) => {
  email.value = newEmail;
});

const handleSubmit = () => {
  emit('submit', {
    name: name.value,
    email: email.value,
    body: body.value,
  });
  body.value = '';
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label" for="comment-author-name">Author Name</label>
      <div class="control has-icons-left">
        <input
          type="text"
          id="comment-author-name"
          placeholder="Enter your name"
          class="input"
          v-model="name"
          required
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label class="label" for="comment-author-email">Author Email</label>
      <div class="control has-icons-left">
        <input
          type="email"
          id="comment-author-email"
          placeholder="Enter your email"
          class="input"
          v-model="email"
          required
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label class="label" for="comment-body">Comment</label>
      <div class="control">
        <textarea
          id="comment-body"
          placeholder="Enter your comment"
          class="textarea"
          v-model="body"
          required
        ></textarea>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Add Comment</button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

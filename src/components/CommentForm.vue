<template>
  <form @submit.prevent="submitComment">
    <div class="field">
      <label class="label">Author Name</label>
      <div
        class="control has-icons-left"
        :class="{ 'has-icons-right': errors.name }"
      >
        <input
          v-model.trim="name"
          class="input"
          :class="{ 'is-danger': errors.name }"
          name="name"
          placeholder="Name Surname"
          @input="validateField('name')"
        />
        <span class="icon is-small is-left">
          <i class="fa-solid fa-user"></i>
        </span>
        <span v-if="errors.name" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle has-text-danger"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger">Name is required</p>
    </div>

    <div class="field">
      <label class="label">Author Email</label>
      <div
        class="control has-icons-left"
        :class="{ 'has-icons-right': errors.email }"
      >
        <input
          v-model.trim="email"
          type="email"
          class="input"
          :class="{ 'is-danger': errors.email }"
          name="email"
          placeholder="Your Email"
          @input="validateField('email')"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span v-if="errors.email" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle has-text-danger"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger">Email is required</p>
    </div>

    <div class="field">
      <label class="label">Write Post Body</label>
      <div class="control" :class="{ 'has-icons-right': errors.body }">
        <textarea
          v-model.trim="body"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          placeholder="Comment"
          @input="validateField('body')"
        ></textarea>
        <span v-if="errors.body" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle has-text-danger"></i>
        </span>
      </div>
      <p v-if="errors.body" class="help is-danger">Comment is required</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Add Comment</button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-inverted"
          @click="clearForm"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { addCommentApi } from '../api/index.js';

const props = defineProps({ postId: Number });
const emit = defineEmits(['comment-added', 'cancel']);

const name = ref('');
const email = ref('');
const body = ref('');

const errors = reactive({
  name: false,
  email: false,
  body: false,
});

const isFormValid = () => {
  let isValid = true;
  if (!name.value) {
    errors.name = true;
    isValid = false;
  }
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = true;
    isValid = false;
  }
  if (!body.value) {
    errors.body = true;
    isValid = false;
  }
  return isValid;
};

const validateField = (field) => {
  if (field === 'name') {
    errors.name = !name.value;
  }
  if (field === 'email') {
    errors.email = !email.value || !/\S+@\S+\.\S+/.test(email.value);
  }
  if (field === 'body') {
    errors.body = !body.value;
  }
};

const clearErrors = () => {
  errors.name = false;
  errors.email = false;
  errors.body = false;
};

const submitComment = async () => {
  clearErrors();
  if (!isFormValid()) {
    return;
  }
  
  const comment = {
    postId: props.postId,
    name: name.value,
    email: email.value,
    body: body.value,
  };
  const newComment = await addCommentApi(comment);

  clearForm();
  emit('comment-added', newComment);
};

const clearForm = () => {
  name.value = '';
  email.value = '';
  body.value = '';
  clearErrors();
  emit('cancel');
};
</script>
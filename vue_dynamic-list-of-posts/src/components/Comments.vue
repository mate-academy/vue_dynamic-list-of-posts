<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';
import Loader from './Loader.vue';

const props = defineProps({
  comments: { type: Array },
  postId: Number,
  isLoading: Boolean,
  errorMessage: String,
});
const emit = defineEmits(['load', 'add', 'delete', 'close']);
const isFormVisible = ref(false);
const name = ref('');
const email = ref('');
const body = ref('');
const errorName = ref('');
const errorEmail = ref('');
const errorBody = ref('');

onMounted(async () => {
  try {
    emit('load', props.postId);
  } catch (error) {
    errorMessage.value = 'Unable to load comments';
  }
});

function submitComment() {
  if (!name.value) {
    errorName.value = 'Name is required';
    return;
  }
  if (!email.value) {
    errorEmail.value = 'Email is required';
    return;
  }
  if (!body.value) {
    errorBody.value = 'Body message is required';
    return;
  }

  emit('add', { postId: props.postId, name: name.value, email: email.value, body: body.value });

  body.value = '';
  errorName.value = '';
  errorEmail.value = '';
  errorBody.value = '';
  isFormVisible.value = true;
}

watch([name, email, body], ([newName, newEmail, newBody]) => {
  if (newName) errorName.value = '';
  if (newEmail) errorEmail.value = '';
  if (newBody) errorBody.value = '';
});

</script>
<template>
  <template v-if="!isFormVisible">
    <div class="block" v-if="comments.length === 0">
      <p class="title is-4">No comments yet</p>
    </div>
    <template v-else>
      <Loader v-if="isLoading" />
      <article class="message is-small" v-else v-for="comment in comments" :key="comment.id">
        <div class="message-header">
          <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
          <button type="button" class="delete is-small" aria-label="delete" @click="emit('delete', comment.id)">
          </button>
        </div>
        <div class="message-body">{{ comment.body }}</div>
      </article>
    </template>
    <button type="button" class="button is-link" @click="isFormVisible = true" v-if="!isFormVisible">Write a
      comment</button>
  </template>
  <form v-if="isFormVisible" @submit.prevent="submitComment">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name-name">
        Author Name
      </label>
      <div class="control has-icons-left has-icons-right">
        <input type="text" name="name" id="comment-author-name-name" placeholder="Name Surname" class="input"
          :class="{ 'is-danger': errorName }" v-model="name" />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span class="icon is-small is-right has-text-danger" data-cy="ErrorIcon" v-if="errorName">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p class="help is-danger" data-cy="ErrorMessage" v-if="errorName">{{ errorName }}</p>
    </div>
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name-email">
        Author Email
      </label>
      <div class="control has-icons-left has-icons-right">
        <input type="email" name="email" id="comment-author-name-email" placeholder="Your Email" class="input"
          :class="{ 'is-danger': errorEmail }" v-model="email" />
        <span class="icon is-small is-left">
          <i class="fas fa-user fa-envelope"></i>
        </span>

        <span class="icon is-small is-right has-text-danger" data-cy="ErrorIcon" v-if="errorEmail">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p class="help is-danger" data-cy="ErrorMessage" v-if="errorEmail">{{ errorEmail }}</p>
    </div>
    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body"> Write Post Body </label>
      <div class="control">
        <textarea id="comment-body" name="body" placeholder="Comment" class="textarea"
          :class="{ 'is-danger': errorBody }" v-model="body"></textarea>
      </div>

      <p class="help is-danger" data-cy="ErrorMessage" v-if="errorBody">{{ errorBody }}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isLoading }">Add comment</button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" @click="emit('close')">Cancel</button>
      </div>
    </div>
  </form>
  <article class="message is-danger" v-if="errorMessage">
    <div class="message-body">
      <p class="help is-danger">{{ errorMessage }}</p>
    </div>
  </article>
</template>
<style>
.message {
  margin-top: 10px;
}
</style>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  currentUser: Object,
});

const emit = defineEmits(['created']);

const BASE_URL = 'https://mate.academy/students-api';

const title = ref('');
const body = ref('');

const errors = ref({});
const error = ref(''); // Реф для загальної помилки API
const isLoading = ref(false);

function validate() {
  errors.value = {};

  if (!title.value.trim()) {
    errors.value.title = 'Title is required.';
  }

  if (!body.value.trim()) {
    errors.value.body = 'Body is required.';
  }

  return Object.keys(errors.value).length === 0;
}

async function submitPost() {
  if (!validate()) {
    return;
  }

  isLoading.value = true;
  error.value = ''; // Скидаємо помилку перед новим запитом

  try {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.value,
        body: body.value,
        // ПОМИЛКА №1 ВИПРАВЛЕНА: використовуємо props.currentUser.id
        userId: props.currentUser.id, 
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to create post');
    }

    const newPost = await res.json();
    emit('created', newPost);
    
    // Очищення форми після успіху
    title.value = '';
    body.value = '';
  } catch (err) {
    console.error(err);
    // Записуємо текст помилки
    error.value = 'Failed to create post. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function clearForm() {
  title.value = '';
  body.value = '';
  errors.value = {};
  error.value = '';
}
</script>

<template>
  <div class="content">
    <h2 class="title is-4">Create New Post</h2>

    <div v-if="error" class="notification is-danger">
      <button class="delete" @click="error = ''"></button>
      {{ error }}
    </div>

    <form @submit.prevent="submitPost">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input 
            v-model="title" 
            class="input" 
            :class="{ 'is-danger': errors.title }" 
            type="text" 
            placeholder="Post title"
          >
        </div>
        <p v-if="errors.title" class="help is-danger">
          {{ errors.title }}
        </p>
      </div>

      <div class="field">
        <label class="label">Body</label>
        <div class="control">
          <textarea 
            v-model="body" 
            class="textarea" 
            :class="{ 'is-danger': errors.body }"
            placeholder="Post body"
          ></textarea>
        </div>
        <p v-if="errors.body" class="help is-danger">
          {{ errors.body }}
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button 
            type="submit" 
            class="button is-link" 
            :class="{ 'is-loading': isLoading }"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button 
            type="button" 
            class="button is-link is-light" 
            @click="clearForm"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
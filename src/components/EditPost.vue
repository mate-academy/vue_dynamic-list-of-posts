<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  post: Object,
})

const emit = defineEmits(['save', 'cancel']);

const title = ref('');
const body = ref('');
const error = ref('');
const isLoading = ref(false);

const BASE_URL = 'https://mate.academy/students-api'

// Слідкуємо за зміною пропса post, щоб оновлювати поля форми
watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      title.value = newPost.title || '';
      body.value = newPost.body || '';
    }
  },
  { immediate: true },
);

async function saveEdits() {
  // Валідація перед відправкою (гарна практика)
  if (!title.value.trim() || !body.value.trim()) {
    error.value = 'Title and body cannot be empty';
    return;
  }

  error.value = '';
  isLoading.value = true;

  try {
    const res = await fetch(`${BASE_URL}/posts/${props.post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.value,
        body: body.value,
        userId: props.post.userId,
      }),
    });
    
    if (!res.ok) { 
      throw new Error('Failed to save post');
    }
    
    const updatedPost = await res.json();
    emit('save', updatedPost);
  } catch (err) {
    error.value = 'Failed to save post. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function cancelEdit() {
  emit('cancel');
}
</script>

<template>
  <div class="block">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input 
          class="input" 
          :class="{ 'is-danger': error && !title }" 
          v-model="title" 
          :disabled="isLoading"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Write Post body</label>
      <div class="control">
        <textarea 
          class="textarea" 
          :class="{ 'is-danger': error && !body }" 
          v-model="body"
          :disabled="isLoading"
        ></textarea>
      </div>
    </div>

    <div class="buttons mt-3">
      <button 
        type="button" 
        class="button is-primary" 
        :class="{ 'is-loading': isLoading }"
        :disabled="isLoading"
        @click="saveEdits"
      >
        Save
      </button>
      
      <button 
        type="button" 
        class="button" 
        :disabled="isLoading"
        @click="cancelEdit"
      >
        Cancel
      </button>
    </div>
    
    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>
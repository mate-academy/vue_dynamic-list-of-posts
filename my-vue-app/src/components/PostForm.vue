<script setup>
import { ref, watch } from 'vue';
const props = defineProps(['initialPost']);
const emit = defineEmits(['submit', 'cancel']);

const title = ref('');
const body = ref('');

watch(() => props.initialPost, (newPost) => {
  title.value = newPost?.title || '';
  body.value = newPost?.body || '';
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', { title: title.value, body: body.value });
  if (!props.initialPost) { title.value = ''; body.value = ''; }
};
</script>

<template>
  <div class="box">
    <h2 class="title is-4">{{ initialPost ? 'Post editing' : 'Create new post' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">Title</label>
        <div class="control has-icons-left">
          <input v-model="title" class="input custom-field" type="text" placeholder="Post title" required />
          <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
        </div>
      </div>
      <div class="field">
        <label class="label">Write Post Body</label>
        <div class="control">
          <textarea v-model="body" class="textarea custom-field" placeholder="Post body" required></textarea>
        </div>
      </div>
      <div class="buttons">
        <button type="submit" class="button is-link">{{ initialPost ? 'Save' : 'Create' }}</button>
        <button type="button" class="button is-link is-light" @click="$emit('cancel')">Cancel</button>
      </div>
    </form>
  </div>
</template>

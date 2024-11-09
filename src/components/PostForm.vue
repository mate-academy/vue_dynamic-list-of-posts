<script setup>
import { ref, watch } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';


const emit = defineEmits(['update', 'closeSidebar']);

const props = defineProps({
  title: String,
  post: { type: Object, default: null }
})

const formData = ref({
  title: props.post?.title || '',
  body: props.post?.body || ''
});

watch(() => props.post, (newPost) => {
  formData.value.title = newPost?.title || '';
  formData.value.body = newPost?.body || '';
});

const error = ref({
  title: '',
  body: '',
});

const fillForm = (event) => {
  const formData = new FormData(event.target);
  const title = formData.get('postTitle');
  const body = formData.get('postBody');

  error.value.title = title ? '' : 'Title is required';
  error.value.body = body ? '' : 'Body is required';

  if (title && body) {
    emit("update", { title, body });
  }
}

const closeSidebar = () => {
  emit('closeSidebar');
}

</script>

<template>
  <div class="content">
    <h2>{{ title }}</h2>

    <form @submit.prevent="fillForm">
      <InputField label="Title" :error="error.title" name="postTitle" v-model="formData.title" />
      <TextAreaField label="Write Post Body" :error="error.body" name="postBody" v-model="formData.body" />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>

        <div class="control">
          <button type="reset" class="button is-link is-light" @click="closeSidebar">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>

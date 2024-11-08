<script setup>
import { ref } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';


const emit = defineEmits(['update', 'closeSidebar']);

const error = ref({
  title: '',
  body: '',
});

const addPost = (event) => { 
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
    <h2>title</h2>

    <form @submit.prevent="addPost">
      <InputField label="Title" :error="error.title" name="postTitle"/>
      <TextAreaField label="Write Post Body" :error="error.body" name="postBody" />

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
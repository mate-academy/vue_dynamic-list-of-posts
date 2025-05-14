<script setup>
import { ref, watch } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { addPost, updatePost } from '@/helpers/posts';

const props = defineProps({
  post: {
    type: Object,
    default: null
  }
});


const userId = JSON.parse(localStorage.getItem('user'))?.id;

const title = ref('');
const body = ref('');

const titleError = ref('')
const bodyError = ref('')

const isSubmitting = ref(false);

const emit = defineEmits(['cancel', 'onAdd', 'onEdit']);

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      title.value = newPost.title;
      body.value = newPost.body;
    } else {
      title.value = '';
      body.value = '';
    }
  },
  { immediate: true }
);

const handleFormSubmit = async () => {
  titleError.value = title.value.trim() ? '' : 'Title cant be empty';
  bodyError.value = body.value.trim() ? '' : 'Body cant be empty';

  if (titleError.value || bodyError.value) {
    return;
  }

  isSubmitting.value = true;


  try {
    const postData = {
      userId,
      title: title.value,
      body: body.value,
    }

    if (props.post) {
      const response = await updatePost({
        postId: props.post.id,
        ...postData,
      });
      emit('onEdit', response);
    } else {
      const response = await addPost(postData);

      emit('onAdd', response);

    }
  } catch (e) {
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="content">
    <h2>{{ post ? 'Edit post' : 'Create new post'}}</h2>

    <form @submit.prevent="handleFormSubmit">
      <InputField :title="'Title'" :name="'title'" :errorMessage="titleError" v-model="title"
        :placeholder="'Post title'" />
      <TextAreaField :title="'Write Post Body'" :errorMessage="bodyError" :placeholder="'Post body'" v-model="body"
        :name="'body'" />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }">Save</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click.prevent="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
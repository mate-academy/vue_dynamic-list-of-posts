<template>
  <form @submit.prevent="submitForm">
    <InputField
      v-model="title"
      name="title"
      id="title"
      label="Title"
      placeholder="Post title"
      :error="titleError ? 'Title is required' : ''"
      data-cy="TitleField"
    />

    <TextareaField
      label="Write Post Body"
      name="body"
      id="post-body"
      placeholder="Post body"
      v-model="body"
      :error="bodyError"
    />
    <p v-if="submitError" class="has-text-danger mt-2">{{ submitError }}</p>
    <div class="field is-grouped">
      <button type="submit" class="button is-link">
        {{ props.post ? 'Save' : 'Create' }}
      </button>
      <div class="control">
        <button type="button" class="button is-light" @click="emit('close')">Cancel</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputField from './InputField.vue'
import TextareaField from './TextareaField.vue'
import { addNewPost, updatePost } from '../server'

const props = defineProps({
  userId: Number,
  post: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'postAdded', 'postUpdated'])

const title = ref(props.post ? props.post.title : '')
const body = ref(props.post ? props.post.body : '')

const titleError = ref('')
const bodyError = ref('')
const submitError = ref('')
const loading = ref(false)

watch(title, () => {
  if (titleError.value) titleError.value = ''
})
watch(body, () => {
  if (bodyError.value) bodyError.value = ''
})

const submitForm = async () => {
  titleError.value = title.value.trim() === '' ? 'Title is required' : ''
  bodyError.value = body.value.trim() === '' ? 'Body is required' : ''
  submitError.value = ''

  if (titleError.value || bodyError.value) return
  loading.value = true

  try {
    if (props.post) {
      const updatedPost = await updatePost(props.post.id, title.value, body.value)
      emit('postUpdated', updatedPost)
    } else {
      const newPost = await addNewPost(props.userId, title.value, body.value)
      emit('postAdded', newPost)
    }

    emit('close')
    title.value = ''
    body.value = ''
  } catch (e) {
    console.error('Failed to submit post:', e)
    submitError.value = 'Failed to submit post. Please try again.'
  }
}
</script>

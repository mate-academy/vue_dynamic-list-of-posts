<script setup>
import { reactive, watch } from 'vue'

import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['cancel', 'clear-error', 'save'])

const postForm = reactive({
  title: props.post.title,
  body: props.post.body,
})

const postFormErrors = reactive({
  title: '',
  body: '',
})

watch(
  () => props.post,
  (post) => {
    postForm.title = post.title
    postForm.body = post.body
    postFormErrors.title = ''
    postFormErrors.body = ''
  },
)

const validatePostForm = () => {
  postFormErrors.title = postForm.title.trim() ? '' : 'Title is required'
  postFormErrors.body = postForm.body.trim() ? '' : 'Post body is required'

  return !postFormErrors.title && !postFormErrors.body
}

const clearFieldError = (fieldName) => {
  postFormErrors[fieldName] = ''
  emit('clear-error')
}

const handleSubmit = () => {
  emit('clear-error')

  if (!validatePostForm()) {
    return
  }

  emit('save', {
    title: postForm.title.trim(),
    body: postForm.body.trim(),
  })
}
</script>

<template>
  <div class="content">
    <h2>Post editing</h2>

    <form novalidate @submit.prevent="handleSubmit">
      <InputField
        id="edit-post-title"
        v-model="postForm.title"
        label="Title"
        name="title"
        placeholder="Post title"
        data-cy="TitleField"
        :error="postFormErrors.title"
        @update:model-value="clearFieldError('title')"
      />

      <TextAreaField
        id="edit-post-body"
        v-model="postForm.body"
        label="Write Post Body"
        name="body"
        placeholder="Post body"
        data-cy="BodyField"
        :error="postFormErrors.body"
        @update:model-value="clearFieldError('body')"
      />

      <div v-if="error" class="notification is-danger is-light">
        {{ error }}
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link" :class="{ 'is-loading': isLoading }">
            Save
          </button>
        </div>

        <div class="control">
          <button type="button" class="button is-link is-light" @click="$emit('cancel')">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

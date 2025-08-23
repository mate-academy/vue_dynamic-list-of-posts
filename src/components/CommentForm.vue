<template>
  <form @submit.prevent="submitComment">
    <InputField
      v-model="authorName"
      name="author-name"
      id="author-name"
      label="Author Name"
      placeholder="Name Surname"
      leftIcon="fas fa-user"
      :error="authorNameError"
    />

    <InputField
      v-model="authorEmail"
      name="author-email"
      id="author-email"
      type="email"
      label="Author Email"
      placeholder="Your Email"
      leftIcon="fas fa-envelope"
      :error="authorEmailError"
    />

    <TextareaField
      v-model="comment"
      name="comment"
      id="comment"
      label="Write Post Body"
      placeholder="Comment"
      :error="commentError"
    />

    <div v-if="submitError" class="notification is-danger">
      {{ submitError }}
      <button type="button" class="delete" @click="submitError = ''"></button>
    </div>

    <div class="field is-grouped mt-3">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': loading }"
          :disabled="loading"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-light" @click="clearForm">Clear</button>
        <button type="button" class="button is-light" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import InputField from './InputField.vue'
import TextareaField from './TextareaField.vue'
import { addComment } from '../server'

const props = defineProps({
  postId: Number,
  initialData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const authorName = ref('')
const authorEmail = ref('')
const comment = ref('')
const loading = ref(false)
const submitError = ref('')

const authorNameError = ref('')
const authorEmailError = ref('')
const commentError = ref('')

onMounted(() => {
  if (props.initialData) {
    authorName.value = props.initialData.name || ''
    authorEmail.value = props.initialData.email || ''
    comment.value = props.initialData.comment || ''
  }
})

watch(authorName, () => {
  authorNameError.value = ''
})
watch(authorEmail, () => {
  authorEmailError.value = ''
})
watch(comment, () => {
  commentError.value = ''
})

const submitComment = async () => {
  authorNameError.value = ''
  authorEmailError.value = ''
  commentError.value = ''
  submitError.value = ''

  if (!authorName.value.trim()) authorNameError.value = 'Name is required'
  if (!authorEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail.value))
    authorEmailError.value = 'Valid email is required'
  if (!comment.value.trim()) commentError.value = 'Comment cannot be empty'

  if (authorNameError.value || authorEmailError.value || commentError.value) return

  try {
    loading.value = true
    const newComment = await addComment(
      props.postId,
      authorName.value,
      authorEmail.value,
      comment.value,
    )
    emit('submit', newComment)

    comment.value = ''
  } catch (error) {
    console.error('Failed to add comment:', error)
    submitError.value = 'Failed to submit comment. Please try again.'
  } finally {
    loading.value = false
  }
}

const clearForm = () => {
  authorName.value = ''
  authorEmail.value = ''
  comment.value = ''
  authorNameError.value = ''
  authorEmailError.value = ''
  commentError.value = ''
  submitError.value = ''
}
</script>

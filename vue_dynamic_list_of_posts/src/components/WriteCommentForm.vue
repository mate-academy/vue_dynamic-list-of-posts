<script setup lang="ts">
import { ref, defineEmits, watch, defineProps } from 'vue'

const props = defineProps<{
  postId: number | undefined,
}>()

const emit = defineEmits(['addComment', 'closeCommentForm'])

const newCommentAuthor = ref('')
const newCommentEmail = ref('')
const newCommentBody = ref('')
const nameError = ref('')
const emailError = ref('')
const bodyError = ref('')


const validateForm = () => {
  let isValid = true

  if (!newCommentAuthor.value.trim()) {
    nameError.value = 'Name is required.'
    isValid = false
  }

  if (!newCommentEmail.value.trim()) {
    emailError.value = 'Email is required.'
    isValid = false
  }

  if (!newCommentBody.value.trim()) {
    bodyError.value = 'Comment body is required.'
    isValid = false
  }

  return isValid
}

const handleFormSubmit = () => {
  if (validateForm()) {
    const newComment = {
      postID: props?.postId,
      commentID: Date.now(),
      name: newCommentAuthor.value,
      email: newCommentEmail.value,
      body: newCommentBody.value
    }

    emit('addComment', newComment)

    newCommentAuthor.value = '';
    newCommentEmail.value = '';
    newCommentBody.value = '';
    nameError.value = '';
    emailError.value = '';
    bodyError.value = '';
  }
}

watch(newCommentAuthor, () => {
  if (newCommentAuthor.value.trim()) {
    nameError.value = ''
  }
})

watch(newCommentEmail, () => {
  if (newCommentEmail.value.trim()) {
    emailError.value = ''
  }
})

watch(newCommentBody, () => {
  if (newCommentBody.value.trim()) {
    bodyError.value = ''
  }
})
</script>

<template>
  <form
    @submit.prevent="handleFormSubmit"
    novalidate
    class="is-flex is-flex-direction-column"
  >
    <label for="title" class="mb-2 has-text-weight-bold">Author Name</label>
    <div class="control has-icons-left">
      <input
        v-model="newCommentAuthor"
        :class="['input mb-2', nameError ? 'is-danger' : '']"
        type="text"
        name="title"
        id="title"
        placeholder="Name Surname"
        required
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
    </div>
    <p v-if="nameError" class="help is-danger">{{ nameError }}</p>

    <label for="title" class="mb-2 has-text-weight-bold">Author Email</label>
    <div class="control has-icons-left">
      <input
        v-model="newCommentEmail"
        :class="['input mb-2', emailError ? 'is-danger' : '']"
        type="text"
        name="title"
        id="title"
        placeholder="Your Email"
        required
      />
      <span class="icon is-small is-left">
        <i class="fas fa-envelope"></i>
      </span>
    </div>
    <p v-if="emailError" class="help is-danger">{{ emailError }}</p>

    <label for="post" class="mb-2 has-text-weight-bold">Write comment body</label>
    <textarea
      v-model="newCommentBody"
      :class="['textarea mb-2', bodyError ? 'is-danger' : '']"
      rows="4"
      name="post"
      id="post"
      placeholder="Comment"
      required
    ></textarea>
    <p v-if="bodyError" class="help is-danger">{{ bodyError }}</p>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Save</button>
      </div>
      <div class="control">
        <button
          type="reset"
          class="button is-link is-light"
          @click="$emit('closeCommentForm')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
form {
  margin-top: 20px;
}

.is-danger {
  border-color: red;
}
.help.is-danger {
  color: red;
  font-size: 0.875rem;
  margin-top: 0;
  margin-bottom: 8px;
}
</style>

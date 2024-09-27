<script setup>
import { ref, onMounted, watch } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const { formName, editedPost } = defineProps({
  formName: String,
  editedPost: Object
})

const emits = defineEmits(['closeForm', 'addPost', 'updatePost', 'selectPost'])

const title = ref('')
const body = ref('')

const errors = ref({
  title: '',
  body: ''
})

onMounted(() => {
  if (formName === 'editPost') {
    title.value = editedPost.title
    body.value = editedPost.body
  }
})

watch([title, body, () => formName], ([newTitle, newBody, newFormName], [, , oldFormName]) => {
  if (newTitle) errors.value.title = ''
  if (newBody) errors.value.body = ''

  if (newFormName === 'addPost' && newFormName !== oldFormName) {
    title.value = ''
    body.value = ''
  }
})

const handleSubmit = () => {
  errors.value.title = title.value ? '' : 'Title is required'
  errors.value.body = body.value ? '' : 'Body is required'

  if (errors.value.title || errors.value.body) {
    return
  }

  if (formName === 'addPost') {
    emits('addPost', { title: title.value, body: body.value })
  }

  if (formName === 'editPost') {
    emits('updatePost', { id: editedPost.id, title: title.value, body: body.value })
  }
}

const handleCloseForm = () => {
  if (formName === 'addPost') {
    emits('closeForm')
  }
  if (formName === 'editPost') {
    emits('selectPost', editedPost)
  }
}
</script>

<template>
  <div class="content">
    <h2>{{ formName === 'addPost' ? 'Create new post' : 'Post editing' }}</h2>

    <form @submit.prevent="handleSubmit()">
      <InputField v-model="title" name="title" :error="errors.title" />

      <TextAreaField v-model="body" name="body" :error="errors.body" />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ formName === 'addPost' ? 'Create' : 'Save' }}
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="handleCloseForm">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

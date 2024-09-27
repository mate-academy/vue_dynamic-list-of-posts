<script setup>
import { reactive, onMounted, watch } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const { formName, editedPost } = defineProps({
  formName: {
    type: String,
    Required: true,
    validator: (value) => ['addPost', 'editPost'].includes(value)
  },
  editedPost: Object
})

const emits = defineEmits(['closeForm', 'addPost', 'updatePost', 'selectPost'])

const form = reactive({
  title: '',
  body: '',
  errors: {
    title: '',
    body: ''
  }
})

// const title = ref('')
// const body = ref('')

// const errors = ref({
//   title: '',
//   body: ''
// })

onMounted(() => {
  if (formName === 'editPost') {
    form.title = editedPost.title
    form.body = editedPost.body
  }
})

watch(
  [() => form.title, () => form.body, () => formName],
  ([newTitle, newBody, newFormName], [, , oldFormName]) => {
    if (newTitle) form.errors.title = ''
    if (newBody) form.errors.body = ''

    if (newFormName === 'addPost' && newFormName !== oldFormName) {
      form.title = ''
      form.body = ''
    }
  }
)

const handleSubmit = () => {
  form.errors.title = form.title ? '' : 'Title is required'
  form.errors.body = form.body ? '' : 'Body is required'

  if (Object.values(form.errors).some((error) => error)) {
    console.error('Form validation failed')
    return
  }

  if (formName === 'addPost') {
    emits('addPost', { title: form.title, body: form.body })
  }

  if (formName === 'editPost') {
    emits('updatePost', { id: editedPost.id, title: form.title, body: form.body })
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
      <InputField v-model="form.title" name="title" :error="form.errors.title" />

      <TextAreaField v-model="form.body" name="body" :error="form.errors.body" />

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

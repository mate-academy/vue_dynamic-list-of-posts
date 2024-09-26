<script setup>
import { ref, onMounted, watch } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const { name, postTitle, postBody } = defineProps({
  name: String,
  postTitle: String,
  postBody: String
})

const emits = defineEmits(['closeForm', 'addPost'])

const formName = ref('')
const title = ref('')
const body = ref('')

const errors = ref({
  title: '',
  body: ''
})

onMounted(() => {
  switch (name) {
    case 'addPost':
      formName.value = 'Create new post'
      break
    case 'editPost':
      formName.value = 'Post editing'
      title.value = postTitle
      body.value = postBody
      break
  }
})

watch(title, () => {
  errors.value.title = ''
})

watch(body, () => {
  errors.value.body = ''
})

const handleSubmit = () => {
  errors.value.title = title.value ? '' : 'Title is required'
  errors.value.body = body.value ? '' : 'Body is required'

  if (errors.value.title || errors.value.body) {
    return
  }

  emits('addPost', { title: title.value, body: body.value })
}
</script>

<template>
  <div className="content">
    <h2>{{ formName }}</h2>

    <form @submit.prevent="name === 'addPost' ? handleSubmit() : null">
      <InputField v-model="title" name="title" :error="errors.title" />

      <TextAreaField v-model="body" name="body" :error="errors.body" />

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">Save</button>
        </div>
        <div className="control">
          <button type="reset" className="button is-link is-light" @click="emits('closeForm')">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

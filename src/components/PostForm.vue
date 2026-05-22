<template>
  <div class="content">
    <h2>{{ isEdit ? 'Edit post' : 'New post' }}</h2>

    <form @submit.prevent="handleSubmit" @reset="handleReset">
      <InputField
        v-model="title"
        id="post-title"
        name="title"
        label="Title"
        placeholder="Post title"
        icon-class="fas fa-heading"
        :error="errors.title"
        @clear-error="errors.title = ''"
      />

      <TextAreaField
        v-model="body"
        id="post-body"
        name="body"
        label="Body"
        placeholder="Post body"
        :error="errors.body"
        @clear-error="errors.body = ''"
      />

      <div v-if="submitError" class="notification is-danger is-light mb-3">
        {{ submitError }}
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': loading }"
            :disabled="loading"
          >
            {{ isEdit ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" :disabled="loading">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const props = defineProps({
  post: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  submitError: { type: String, default: '' },
})
const emit = defineEmits(['submit', 'cancel'])

const isEdit = !!props.post
const title = ref(props.post?.title ?? '')
const body = ref(props.post?.body ?? '')
const errors = ref({ title: '', body: '' })

watch(() => props.post, (p) => {
  title.value = p?.title ?? ''
  body.value = p?.body ?? ''
  errors.value = { title: '', body: '' }
})

function validate() {
  let valid = true
  if (!title.value.trim()) { errors.value.title = 'Title is required'; valid = false }
  if (!body.value.trim()) { errors.value.body = 'Body is required'; valid = false }
  return valid
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { title: title.value.trim(), body: body.value.trim() })
}

function handleReset() {
  title.value = props.post?.title ?? ''
  body.value = props.post?.body ?? ''
  errors.value = { title: '', body: '' }
  emit('cancel')
}
</script>

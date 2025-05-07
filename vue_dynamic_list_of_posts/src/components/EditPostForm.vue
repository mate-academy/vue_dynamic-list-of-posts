<template>
  <form @submit.prevent="handleSave">
    <div class="is-flex is-flex-direction-column is-gap-2">
      <h2 class="post-title">Post editing</h2>

      <div class="control has-icons-left">
        <input
          v-model="editedTitle"
          :class="['input', titleError ? 'is-danger' : '']"
          type="text"
          placeholder="Post title"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <p v-if="titleError" class="help is-danger">{{ titleError }}</p>

      <textarea
        v-model="editedBody"
        :class="['textarea', bodyError ? 'is-danger' : '']"
        placeholder="Post body"
        rows="4"
      ></textarea>
      <p v-if="bodyError" class="help is-danger">{{ bodyError }}</p>
    </div>

    <div class="field is-grouped mt-2">
      <div class="control">
        <button type="submit" class="button is-link">Save</button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="$emit('cancelEdit')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post';
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps<{
  editedPost: Post | null
}>()

const emits = defineEmits(['save', 'cancelEdit'])

const editedTitle = ref(props.editedPost?.title)
const editedBody = ref(props.editedPost?.body)
const titleError = ref('')
const bodyError = ref('')

watch(
  () => [props.editedPost?.title, props.editedPost?.body],
  ([newTitle, newBody]) => {
    editedTitle.value = newTitle || ''
    editedBody.value = newBody || ''
  },
)

const validateForm = () => {
  let isValid = true

  if (!editedTitle.value?.trim()) {
    titleError.value = 'Title is required.'
    isValid = false
  }

  if (!editedBody.value?.trim()) {
    bodyError.value = 'Post body is required.'
    isValid = false
  }

  return isValid
}

const handleSave = () => {
  if (validateForm()) {
    emits('save', {
      title: editedTitle.value,
      body: editedBody.value,
      id: props.editedPost?.id,
    })

    titleError.value = ''
    bodyError.value = ''
  }
}

watch(editedTitle, () => {
  if (editedTitle.value?.trim()) {
    titleError.value = ''
  }
})

watch(editedBody, () => {
  if (editedBody.value?.trim()) {
    bodyError.value = ''
  }
})
</script>

<style scoped>
.post-title {
  font-size: 24px;
  font-weight: bold;
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

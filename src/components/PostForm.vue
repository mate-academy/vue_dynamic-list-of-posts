<script setup>
import { ref, onMounted } from 'vue'
import { ErrorMessages } from '@/utils/ErrorMessages'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value),
  },
  currentPost: {
    type: Object,
  },
})

const localTitle = ref('')
const localBody = ref('')
const titleError = ref('')
const bodyError = ref('')

const emit = defineEmits(['update:currentPost', 'submit', 'cancel'])

onMounted(() => {
  if (props.mode === 'edit') {
    localTitle.value = props.currentPost.title
    localBody.value = props.currentPost.body
  }
})

const handleSubmit = () => {
  const titleTrimmed = localTitle.value.trim()
  const bodyTrimmed = localBody.value.trim()

  titleError.value = ''
  bodyError.value = ''

  if (!titleTrimmed) {
    titleError.value = ErrorMessages.Title_Post_Is_Empty
  }
  if (!bodyTrimmed) {
    bodyError.value = ErrorMessages.Text_Area_Is_Empty
  }

  if (titleError.value || bodyError.value) {
    return
  }

  emit('submit', titleTrimmed, bodyTrimmed)
}
</script>

<template>
  <div class="content">
    <h2>{{ mode === 'create' ? 'Create new post' : 'Post editing' }}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        :modelValue="localTitle"
        v-model:error="titleError"
        title="Title"
        name="title"
        placeholder="Post title"
        icon="fa-user"
        @update:modelValue="(val) => (localTitle = val)"
      />

      <TextAreaField
        :modelValue="localBody"
        v-model:error="bodyError"
        title="Write Post Body"
        name="body"
        placeholder="Post body"
        @update:modelValue="(val) => (localBody = val)"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ mode === 'create' ? 'Create' : 'Save' }}
          </button>
        </div>

        <div class="control">
          <button type="reset" class="button is-link is-light" @click="emit('cancel')">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>

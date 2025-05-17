<script setup>
import { SideBarEnum } from '@/utils/SideBarModes'
import { createPost } from '@/api/posts'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { ErrorMessages } from '@/utils/ErrorMessages.js'
import { ref } from 'vue'
const posts = defineModel('posts', {
  type: Array,
})
const currentPostId = defineModel('currentPostId', {
  type: Number,
})
const title = defineModel('title', {
  type: String,
})
const body = defineModel('body', {
  type: String,
})
const sideBarMode = defineModel('sideBarMode', {
  type: String,
})

const errorMessages = {
  titleError: ErrorMessages.None,
  bodyError: ErrorMessages.None,
}
const errors = ref({
  ...errorMessages,
})

const onSubmit = async () => {
  try {
    const newPost = await createPost(title.value.trim(), body.value.trim())

    sideBarMode.value = SideBarEnum.New_Post_Form
    posts.value.push(newPost)

    currentPostId.value = newPost.id
    title.value = ''
    body.value = ''
  } catch (error) {
    console.error(error)
  }
}

const onFormSubmit = async () => {
  errors.value = { ...errorMessages }
  if (!title.value.trim()) {
    errors.value.titleError = ErrorMessages.Title_Post_Is_Empty
  }
  if (!body.value.trim()) {
    errors.value.bodyError = ErrorMessages.Text_Area_Is_Empty
  }
  if (errors.value.titleError || errors.value.bodyError) {
    return
  }

  await onSubmit()
}

const onCancel = async () => {
  sideBarMode.value = ''
  title.value = ''
  body.value = ''
}
</script>

<template>
  <div class="content" v-if="sideBarMode === SideBarEnum.New_Post_Form">
    <h2>Create New Post</h2>

    <form @submit.prevent="onFormSubmit" @reset="onCancel">
      <InputField
        v-model="title"
        v-model:error="errors.titleError"
        icon="fa-user"
        placeholder="Type title of your post"
        type="text"
        title="Title"
      />
      <TextAreaField
        v-model="body"
        v-model:error="errors.bodyError"
        title="Text"
        placeholder="Type text of your post"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { SideBarEnum } from '@/utils/SideBarModes'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { ref } from 'vue'
import { editPost } from '@/api/posts'
import { ErrorMessages } from '@/utils/ErrorMessages.js'

const errorMessages = {
  titleError: ErrorMessages.None,
  bodyError: ErrorMessages.None,
}
const title = defineModel('title', {
  type: String,
})
const body = defineModel('body', {
  type: String,
})
const sideBarMode = defineModel('sideBarMode', {
  type: String,
})

const errors = ref({
  ...errorMessages,
})
const isLoading = defineModel('isLoading', {
  type: Boolean,
})
const currentPostId = defineModel('currentPostId', {
  type: Number,
})
const posts = defineModel('posts', {
  type: Array,
})

const onEditSubmit = async () => {
  isLoading.value = true
  sideBarMode.value = SideBarEnum.Edit_Post_Form
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

  try {
    await editPost(currentPostId.value, title.value.trim(), body.value.trim())
    posts.value = posts.value.map((post) => {
      if (post.id === currentPostId.value) {
        return { ...post, title: title.value, body: body.value }
      }
      return post
    })
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="content" v-if="sideBarMode === SideBarEnum.Edit_Post_Form">
    <h2>Edit Post</h2>

    <form @submit.prevent="onEditSubmit" @reset="onCancel">
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
          <button type="submit" :class="['button is-link', { 'is-loading': !!isLoading }]">
            Save
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

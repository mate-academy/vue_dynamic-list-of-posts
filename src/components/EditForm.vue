<script setup>
import { SideBarEnum } from '@/utils/SideBarModes'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { ref } from 'vue'
import { editPost } from '@/api/api.posts'
import { ErrorMessages } from '@/utils/ErrorMessages'
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
  type: Object,
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
const onEdit = async () => {
  isLoading.value = true
  sideBarMode.value = sideBarMode.value === SideBarEnum.Edit_Post_Form
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
const onEditSubmit = async () => {
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
  await onEdit()
}
</script>
<template>
  <div className="content" v-if="sideBarMode === SideBarEnum.Edit_Post_Form">
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

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'button is-link is-loading': !!isLoading }"
          >
            Save
          </button>
        </div>
        <div className="control">
          <button type="reset" className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<template>
  <div className="content">
    <h2 v-if="isEditing">Post editing</h2>
    <h2 v-else>Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        :name="'Title'"
        :placeholder="'Post title'"
        :textError="titleErrorMessage"
        v-model="titleValue"
      />

      <TextAreaField
        :name="'Write Post Body'"
        :placeholder="'Post body'"
        :textError="textAreaErrorMessage"
        v-model="textAreaValue"
      />
      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link" v-if="isEditing">Save</button>
          <button type="submit" className="button is-link" v-else>Create</button>
        </div>
        <div className="control">
          <button type="reset" @click="handleCancel" className="button is-link is-light">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import InputField from '@/components/InputField.vue'
import TextAreaField from '@/components/TextAreaField.vue'
import { createPost, updatePost } from '@/api/post'
import type { Post } from '@/types/post'

export default defineComponent({
  name: 'AddPost',
  data(): {
    titleValue: string
    titleErrorMessage: string
    textAreaValue: string
    textAreaErrorMessage: string
  } {
    return {
      titleValue: '',
      titleErrorMessage: '',
      textAreaValue: '',
      textAreaErrorMessage: '',
    }
  },
  props: {
    userId: {
      type: Number,
    },
    updatePosts: {
      type: Function,
      required: true,
    },
    cancelEdit: {
      type: Function,
      required: true,
    },
    currentPost: {
      type: Object as PropType<Post | null>,
    },
    isEditing: {
      type: Object as PropType<Post | null>,
    },
  },
  components: {
    InputField,
    TextAreaField,
  },
  watch: {
    titleValue() {
      this.clearErrors()
    },
    textAreaValue() {
      this.clearErrors()
    },
    isEditing(newValue) {
      if (!newValue) {
        this.clearErrors()
        this.clearFields()
      }
    },
  },
  mounted() {
    this.clearErrors()
    this.clearFields()

    if (this.isEditing) {
      this.titleValue = this.isEditing.title
      this.textAreaValue = this.isEditing.body
    }
  },
  methods: {
    handleSubmit() {
      let hasError = false

      // check title
      if (!this.titleValue.trim()) {
        this.titleErrorMessage = 'Title is required'
        hasError = true
      } else {
        this.titleErrorMessage = ''
      }

      // check textArea
      if (!this.textAreaValue.trim()) {
        this.textAreaErrorMessage = 'Body is required'
        hasError = true
      } else {
        this.textAreaErrorMessage = ''
      }

      if (hasError) {
        return
      }

      if (this.userId) {
        if (this.isEditing) {
          updatePost({
            postId: this.isEditing.id,
            userId: this.userId,
            title: this.titleValue,
            body: this.textAreaValue,
          })
            .then((updatedPost) => {
              if (updatedPost) {
                this.updatePosts(updatedPost)
              }
              this.clearFields()
            })
            .catch((er) => {
              throw er
            })
        } else {
          createPost({
            userId: this.userId,
            title: this.titleValue,
            body: this.textAreaValue,
          })
            .then((createdPost) => {
              if (createdPost) {
                this.updatePosts(createdPost)
              }
              this.clearFields()
            })
            .catch((er) => {
              throw er
            })
        }
      }
    },
    clearErrors() {
      this.titleErrorMessage = ''
      this.textAreaErrorMessage = ''
    },
    clearFields() {
      this.titleValue = ''
      this.textAreaValue = ''
      this.clearErrors()
    },
    handleCancel() {
      this.clearFields()
      this.cancelEdit()
    },
  },
})
</script>

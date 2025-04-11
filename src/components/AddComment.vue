<template>
  <div class="block">
    <form @submit.prevent="handleSubmit" @reset.prevent="handleCancel">
      <InputField
        :name="'Author Name'"
        :placeholder="'Name Surname'"
        :text-error="commentNameError"
        v-model="commentName"
      />
      <InputField
        :name="'Author Email'"
        :placeholder="'Your Email'"
        :text-error="commentAuthorError"
        v-model="commentAuthor"
      />
      <TextAreaField
        :name="'Write Post Body'"
        :placeholder="'Comment'"
        :text-error="commentBodyError"
        v-model="commentBody"
      />
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add Comment</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { createComment } from '@/api/comment'
import InputField from '@/components/InputField.vue'
import TextAreaField from '@/components/TextAreaField.vue'
import type { Comment } from '@/types/comment'
import type { PropType } from 'vue'

export default {
  name: 'AddComment',
  data(): {
    commentName: string
    commentNameError: string
    commentAuthor: string
    commentAuthorError: string
    commentBody: string
    commentBodyError: string
  } {
    return {
      commentName: '',
      commentNameError: '',
      commentAuthor: '',
      commentAuthorError: '',
      commentBody: '',
      commentBodyError: '',
    }
  },
  props: {
    commentTogleModel: {
      type: Boolean,
      required: true,
    },
    commentsModel: {
      type: Object as PropType<Comment[]>,
      required: true,
    },
    postId: {
      type: Number,
      required: false,
    },
  },
  emits: ['update:commentTogleModel', 'update:commentsModel'],
  components: {
    InputField,
    TextAreaField,
  },
  methods: {
    handleSubmit() {
      let hasError = false

      // check Name
      if (!this.commentName.trim()) {
        this.commentNameError = 'Name is required'
        hasError = true
      } else {
        this.commentNameError = ''
      }

      // check Email
      if (!this.commentAuthor.trim()) {
        this.commentAuthorError = 'Email is required'
        hasError = true
      } else {
        this.commentAuthorError = ''
      }

      // check Comment Body
      if (!this.commentBody.trim()) {
        this.commentBodyError = 'Comment is required'
        hasError = true
      } else {
        this.commentBodyError = ''
      }

      if (hasError) {
        return
      }

      if (this.postId) {
        createComment({
          postId: this.postId,
          name: this.commentName,
          email: this.commentAuthor,
          body: this.commentBody,
        })
          .then((createdComment) => {
            const newComments = [...this.commentsModel, createdComment]

            this.$emit('update:commentsModel', newComments)
            this.clearFields()
            this.$emit('update:commentTogleModel', false)
          })
          .catch((er) => {
            throw er
          })
      }
    },
    handleCancel() {
      this.clearFields()
      this.$emit('update:commentTogleModel', false)
    },
    clearErrors() {
      this.commentNameError = ''
      this.commentAuthorError = ''
      this.commentBodyError = ''
    },
    clearFields() {
      this.clearErrors()

      this.commentName = ''
      this.commentAuthor = ''
      this.commentBody = ''
    },
  },
}
</script>

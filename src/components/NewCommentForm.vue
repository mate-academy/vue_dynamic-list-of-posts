<script lang="ts">
import type { PropType } from 'vue'
import { useUserStore } from '@/stores/users'
import InputTemplate from '../ui/inputTemplate.vue'
import ButtonTemplate from '../ui/buttonTemplate.vue'
import { usePostsStore } from '@/stores/posts'
import { postNewComment } from '@/api/comments'
import type { CustomComment } from '@/types/CustomComment'
import type { NewComment } from '@/types/Comment'
import type { Post } from '@/types/Post'

export default {
  components: { InputTemplate, ButtonTemplate },

  props: {
    selectedPost: Object as PropType<Post | null>
  },

  watch: {
    selectedPost() {
      if (this.selectedPost) {
        this.isNameError = false
        this.isEmailError = false
        this.isTextError = false
        this.commentText = ''
      }
    }
  },

  data() {
    return {
      isNameError: false,
      isEmailError: false,
      isTextError: false,
      submitting: false,
      authorName: '',
      authorEmail: '',
      commentText: '',
      newCommentError: false
    }
  },

  emits: ['addNewComment'],

  methods: {
    handleSubmit() {
      this.submitting = true
      this.isEmailError = !this.authorEmail
      this.isNameError = !this.authorName
      this.isTextError = !this.commentText

      if (!this.authorEmail || !this.authorName || !this.commentText) {
        this.submitting = false
        return
      }
      const userStore = useUserStore()

      if (this.selectedPost && userStore.user.id) {
        const newComment: NewComment = {
          postId: this.selectedPost.id,
          name: this.authorName,
          email: this.authorEmail,
          body: this.commentText
        }

        postNewComment(newComment)
          .then(({ data }) => {
            this.$emit('addNewComment', data)
          })
          .catch(() => (this.newCommentError = true))
          .finally(() => this.resetForm())
      } else {
        const postsList = usePostsStore()
        const post = postsList.posts.find((post) => post.id === this.selectedPost?.id)

        if (post) {
          const id = post.comments[post.comments.length - 1]?.id + 1 || 1

          const newComment: CustomComment = {
            id,
            name: this.authorName,
            email: this.authorEmail,
            body: this.commentText
          }

          post.comments.push(newComment)
          this.resetForm()
        }
      }
    },

    resetForm() {
      this.commentText = ''
      this.isNameError = false
      this.isEmailError = false
      this.isTextError = false
      this.submitting = false
    }
  }
}
</script>

<template>
  <form data-cy="NewCommentForm" @submit.prevent="handleSubmit">
    <InputTemplate
      label="Author Name"
      v-model="authorName"
      :error="isNameError"
      data-cy="NameField"
      id="comment-author-name"
      name="name"
      placeholder="Name Surname"
      errorMessage="Name is required"
      icon="fa-user"
    />

    <InputTemplate
      name="email"
      label="Author Email"
      v-model="authorEmail"
      :error="isEmailError"
      data-cy="EmailField"
      id="comment-author-email"
      placeholder="email@test.com"
      errorMessage="Email is required"
      icon="fa-user"
    />

    <InputTemplate
      label="Comment Text"
      v-model="commentText"
      :error="isTextError"
      data-cy="BodyField"
      id="comment-body"
      name="body"
      placeholder="Type comment here"
      errorMessage="Enter some text"
      :textArea="true"
    />

    <div class="field is-grouped">
      <div class="control">
        <ButtonTemplate buttonType="submit" class="is-link" :submitting="submitting" label="Add" />
      </div>

      <div class="control">
        <ButtonTemplate
          buttonType="reset"
          class="is-light"
          label="Clear"
          @handleButton="resetForm"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import InputTemplate from '../ui/inputTemplate.vue'
import ButtonTemplate from '../ui/buttonTemplate.vue'
import type { Comment } from '@/types/Comment'
import { useUserStore } from '@/stores/users'
import { postNewPost, updatePost } from '@/api/posts'
import { usePostsStore } from '@/stores/posts'
import type { Post } from '@/types/Post'

export default defineComponent({
  components: { InputTemplate, ButtonTemplate },

  props: {
    addNewPost: Boolean,
    editing: Boolean,
    editingDetails: Object as PropType<Post | null>
  },

  emits: ['closeModal'],

  data() {
    return {
      titleName: '',
      isTitleError: false,
      submitting: false,
      commentText: '',
      isTextError: false,
      commentsList: [] as Comment[]
    }
  },

  watch: {
    editing() {
      if (this.editing && this.editingDetails) {
        this.titleName = this.editingDetails.title
        this.commentText = this.editingDetails.body
      } else {
        this.titleName = ''
        this.commentText = ''
      }
    }
  },

  methods: {
    handleSubmit() {
      this.submitting = true

      this.isTextError = !this.commentText.trim()
      this.isTitleError = !this.titleName.trim()

      if (!this.commentText.trim() || !this.titleName.trim()) {
        this.submitting = false
        return
      }

      const userStore = useUserStore()

      if (userStore.user.id) {
        const newPost = {
          userId: userStore.user.id,
          title: this.titleName,
          body: this.commentText
        }

        if (this.editing) {
          if (this.editingDetails) {
            updatePost(this.editingDetails?.id, newPost).then(() => {
              this.submitting = false
              this.titleName = ''
              this.commentText = ''
              this.$emit('closeModal')
            })
          }
        } else {
          postNewPost(newPost).then(() => {
            this.submitting = false
            this.titleName = ''
            this.commentText = ''
            this.$emit('closeModal')
          })
        }
      } else {
        const postsStore = usePostsStore()
        let postsArr = postsStore.posts

        if (this.editing) {
          if (this.editingDetails) {
            postsArr = postsArr.map((post) => {
              if (post.id === this.editingDetails?.id) {
                post.title = this.titleName
                post.body = this.commentText

                return post
              }
              return post
            })
          }
          this.$emit('closeModal')
        } else {
          const nextId = postsArr[postsArr.length - 1]?.id + 1 || 1

          const newPost = {
            id: nextId,
            title: this.titleName,
            body: this.commentText,
            comments: []
          }

          postsArr.push(newPost)
        }

        this.titleName = ''
        this.commentText = ''
        this.submitting = false
      }
    }
  }
})
</script>

<template>
  <div
    data-cy="Sidebar"
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': addNewPost }"
    style="flex: 1"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <div class="content">
          <h2>{{ editing ? 'Post editing' : 'Create new post' }}</h2>

          <form @submit.prevent="handleSubmit">
            <InputTemplate
              label="Title"
              v-model="titleName"
              :error="isTitleError"
              data-cy="NameField"
              id="comment-author-name-title"
              name="title"
              placeholder="Post title"
              errorMessage="Title is required"
              icon="fa-user fa-heading"
            />

            <InputTemplate
              label="Write Post Body"
              v-model="commentText"
              :error="isTextError"
              data-cy="BodyField"
              id="comment-body"
              name="body"
              placeholder="Post body"
              errorMessage="Enter some text"
              :textArea="true"
            />

            <div class="field is-grouped">
              <div class="control">
                <ButtonTemplate
                  buttonType="submit"
                  class="is-link"
                  :submitting="submitting"
                  :label="editing ? 'Save' : 'Create'"
                />
              </div>

              <div class="control">
                <ButtonTemplate
                  buttonType="reset"
                  class="is-light"
                  :label="editing ? 'Cancel' : 'Clear'"
                  @handleButton="$emit('closeModal')"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

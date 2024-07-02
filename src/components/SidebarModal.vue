<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import CommentsList from './CommentsList.vue'
import ButtonTemplate from '../ui/buttonTemplate.vue'
import LoaderSpinner from './LoaderSpinner.vue'
import NewCommentForm from './NewCommentForm.vue'
import { getUserComments, removeUserComment } from '@/api/comments'
import { useUserStore } from '@/stores/users'
import { usePostsStore } from '@/stores/posts'
import type { Comment } from '@/types/Comment'
import type { Post } from '@/types/Post'
import type { CustomComment } from '@/types/CustomComment'

export default defineComponent({
  components: { ButtonTemplate, LoaderSpinner, CommentsList, NewCommentForm },
  name: 'SidebarModal',
  props: {
    selectedPost: Object as PropType<Post | null>
  },

  emits: ['handleEditPost', 'handleRemovePost'],

  data() {
    return {
      commentsList: [] as Comment[] | CustomComment[],
      isNewCommentOpen: false as boolean,
      loadingComments: false,
      fetchCommentsError: false
    }
  },

  watch: {
    selectedPost() {
      if (this.selectedPost) {
        this.fetchPostComments(this.selectedPost.id)
        this.isNewCommentOpen = false
      }
    }
  },

  methods: {
    fetchPostComments(postId: number) {
      this.loadingComments = true
      const userStore = useUserStore()

      if (userStore.user.id) {
        getUserComments<Comment[]>(postId)
          .then((response) => {
            this.commentsList = response.data
          })
          .catch(() => {
            this.fetchCommentsError = true
          })
          .finally(() => (this.loadingComments = false))
      } else {
        const postsStore = usePostsStore()

        this.commentsList = postsStore.posts.find((post) => post.id === postId)?.comments || []
        this.loadingComments = false
      }
    },

    fetchDeleteComment(id: number) {
      const userStore = useUserStore()

      if (userStore.user.id) {
        removeUserComment(id)
          .then(() => {
            this.commentsList = this.commentsList.filter((comment) => comment.id !== id)
          })
          .catch(() => {
            this.fetchCommentsError = true
          })
      } else {
        const postsStore = usePostsStore()

        postsStore.posts = postsStore.posts.map((post) => {
          if (this.selectedPost && post.id === this.selectedPost.id) {
            post.comments = post.comments.filter((comment) => comment.id !== id)

            return post
          }

          return post
        })

        this.commentsList = this.commentsList.filter((comment) => comment.id !== id)
      }
    },

    addNewComment(comment: Comment) {
      this.commentsList.push(comment)
    }
  }
})
</script>

<template>
  <div
    data-cy="Sidebar"
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': selectedPost }"
    style="flex: 1"
  >
    <div class="tile is-child box is-success">
      <div class="content" data-cy="PostDetails">
        <div class="content" data-cy="PostDetails">
          <div class="block">
            <div class="is-flex is-justify-content-space-between is-align-items-center">
              <h2 data-cy="PostTitle">{{ `#${selectedPost?.id}: ${selectedPost?.title}` }}</h2>
              <div class="is-flex">
                <span class="icon is-small is-right is-clickable" @click="$emit('handleEditPost')">
                  <i class="fas fa-pen-to-square" />
                </span>
                <span
                  class="icon is-small is-right has-text-danger is-clickable ml-3"
                  @click="$emit('handleRemovePost')"
                >
                  <i class="fas fa-trash" />
                </span>
              </div>
            </div>
            <p data-cy="PostBody">{{ selectedPost?.body }}</p>
          </div>

          <div class="block">
            <LoaderSpinner v-if="loadingComments" />

            <div class="notification is-danger" data-cy="CommentsError" v-if="fetchCommentsError">
              Something went wrong
            </div>

            <p class="title is-4" v-if="!commentsList.length" data-cy="NoCommentsMessage">
              No comments yet
            </p>

            <p class="title is-4">Comments:</p>

            <CommentsList :commentsList="commentsList" @fetchDeleteComment="fetchDeleteComment" />

            <ButtonTemplate
              data-cy="WriteCommentButton"
              buttonType="button"
              label="Write a comment"
              @handleButton="isNewCommentOpen = true"
            />
          </div>

          <NewCommentForm
            v-if="isNewCommentOpen"
            @addNewComment="addNewComment"
            :selectedPost="selectedPost"
          />
          <!--    <form data-cy="NewCommentForm" @submit.prevent="handleSubmit" v-if="isNewCommentOpen">
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
                <ButtonTemplate
                  buttonType="submit"
                  class="is-link"
                  :submitting="submitting"
                  label="Add"
                />
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
          </form> -->
        </div>
      </div>
    </div>
  </div>
</template>

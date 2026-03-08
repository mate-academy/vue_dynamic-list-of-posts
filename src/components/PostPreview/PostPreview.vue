<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Comment from '../Comment/PostComment.vue'
import Loader from '../Loader/DataLoader.vue'
import type { Post, Comment as CommentType } from '../../api/posts'
import { getComments, createComment, deleteComment } from '../../api/posts'

export default defineComponent({
  components: { Comment, Loader },

  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },

  emits: ['edit', 'delete'],

  setup(props, { emit }) {
    // --- Comments state ---
    const comments = ref<CommentType[]>([])
    const isLoadingComments = ref(false)
    const commentsError = ref(false)

    // --- New comment form state ---
    const showCommentForm = ref(false)
    const isSubmitting = ref(false)
    const newComment = ref({ name: '', email: '', body: '' })
    const errors = ref({ name: '', email: '', body: '' })

    // --- Load comments when post changes ---
    async function loadComments(postId: number) {
      isLoadingComments.value = true
      commentsError.value = false
      showCommentForm.value = false
      comments.value = []

      try {
        comments.value = await getComments(postId)
      } catch {
        commentsError.value = true
      } finally {
        isLoadingComments.value = false
      }
    }

    watch(
      () => props.post.id,
      (id) => loadComments(id),
      { immediate: true },
    )

    // --- Delete comment (optimistic) ---
    function handleDeleteComment(commentId: number) {
      comments.value = comments.value.filter((c) => c.id !== commentId)
      deleteComment(commentId).catch(() => {
        // optionally show error
      })
    }

    // --- Comment form validation ---
    function validate() {
      errors.value.name = newComment.value.name.trim() ? '' : 'Name is required'
      errors.value.email = newComment.value.email.trim() ? '' : 'Email is required'
      errors.value.body = newComment.value.body.trim() ? '' : 'Comment is required'

      return !errors.value.name && !errors.value.email && !errors.value.body
    }

    // --- Submit new comment ---
    async function handleSubmitComment() {
      if (!validate()) return

      isSubmitting.value = true

      try {
        const created = await createComment({
          postId: props.post.id,
          name: newComment.value.name.trim(),
          email: newComment.value.email.trim(),
          body: newComment.value.body.trim(),
        })

        comments.value.push(created)
        // keep name + email, clear only body
        newComment.value.body = ''
        errors.value.body = ''
      } catch {
        // optionally show submit error
      } finally {
        isSubmitting.value = false
      }
    }

    function handleClearForm() {
      newComment.value = { name: '', email: '', body: '' }
      errors.value = { name: '', email: '', body: '' }
    }

    return {
      comments,
      isLoadingComments,
      commentsError,
      showCommentForm,
      isSubmitting,
      newComment,
      errors,
      handleDeleteComment,
      handleSubmitComment,
      handleClearForm,
      emit,
    }
  },
})
</script>

<template>
  <!-- Post header -->
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="$emit('edit')">
          <i class="fas fa-pen-to-square" />
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="$emit('delete', post.id)"
        >
          <i class="fas fa-trash" />
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
  </div>

  <!-- Comments section -->
  <div class="block">
    <Loader v-if="isLoadingComments" />

    <div v-else-if="commentsError" class="notification is-danger is-light">
      Something went wrong loading comments.
    </div>

    <template v-else>
      <p v-if="comments.length === 0" class="title is-4">No comments yet</p>

      <template v-else>
        <p class="title is-4">Comments:</p>
        <Comment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @delete="handleDeleteComment"
        />
      </template>

      <!-- Write a comment button -->
      <button
        v-if="!showCommentForm"
        type="button"
        class="button is-link"
        @click="showCommentForm = true"
      >
        Write a comment
      </button>

      <!-- New comment form -->
      <div v-else class="box">
        <p class="title is-5">Write a comment</p>

        <!-- Name -->
        <div class="field">
          <label class="label">Author Name</label>
          <div class="control">
            <input
              v-model="newComment.name"
              class="input"
              :class="{ 'is-danger': errors.name }"
              type="text"
              placeholder="Your name"
              @input="errors.name = ''"
            />
          </div>
          <p v-if="errors.name" class="help is-danger">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div class="field">
          <label class="label">Author Email</label>
          <div class="control">
            <input
              v-model="newComment.email"
              class="input"
              :class="{ 'is-danger': errors.email }"
              type="email"
              placeholder="your@email.com"
              @input="errors.email = ''"
            />
          </div>
          <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
        </div>

        <!-- Body -->
        <div class="field">
          <label class="label">Comment</label>
          <div class="control">
            <textarea
              v-model="newComment.body"
              class="textarea"
              :class="{ 'is-danger': errors.body }"
              placeholder="Write your comment..."
              @input="errors.body = ''"
            >
            </textarea>
          </div>
          <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
        </div>

        <!-- Actions -->
        <div class="field is-grouped">
          <div class="control">
            <button
              type="button"
              class="button is-link"
              :class="{ 'is-loading': isSubmitting }"
              @click="handleSubmitComment"
            >
              Add
            </button>
          </div>
          <div class="control">
            <button type="button" class="button is-link is-light" @click="handleClearForm">
              Clear
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

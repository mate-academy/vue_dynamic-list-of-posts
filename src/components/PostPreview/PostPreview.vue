<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Comment from '../Comment/PostComment.vue'
import Loader from '../Loader/DataLoader.vue'
import CommentForm from '../CommentForm/CommentForm.vue'
import type { Post, Comment as CommentType } from '../../api/posts'
import { getComments, deleteComment } from '../../api/posts'

export default defineComponent({
  name: 'PostPreview',
  components: { Comment, Loader, CommentForm },

  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },

  emits: ['edit', 'delete'],

  setup(props) {
    const comments = ref<CommentType[]>([])
    const isLoadingComments = ref(false)
    const commentsError = ref(false)
    const showCommentForm = ref(false)
    const deleteError = ref('')

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

    async function handleDeleteComment(commentId: number) {
      const backup = [...comments.value]
      comments.value = comments.value.filter((c) => c.id !== commentId)
      deleteError.value = ''

      try {
        await deleteComment(commentId)
      } catch {
        comments.value = backup
        deleteError.value = 'Failed to delete comment. Please try again.'
      }
    }

    function handleCommentCreated(comment: CommentType) {
      comments.value.push(comment)
    }

    return {
      comments,
      isLoadingComments,
      commentsError,
      showCommentForm,
      deleteError,
      handleDeleteComment,
      handleCommentCreated,
    }
  },
})
</script>

<template>
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
    <p>{{ post.body }}</p>
  </div>

  <div class="block">
    <Loader v-if="isLoadingComments" />

    <div v-else-if="commentsError" class="notification is-danger is-light">
      Something went wrong loading comments.
    </div>

    <template v-else>
      <div v-if="deleteError" class="notification is-danger is-light">
        {{ deleteError }}
      </div>

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

      <button
        v-if="!showCommentForm"
        type="button"
        class="button is-link"
        @click="showCommentForm = true"
      >
        Write a comment
      </button>

      <CommentForm v-else :post-id="post.id" @comment-created="handleCommentCreated" />
    </template>
  </div>
</template>

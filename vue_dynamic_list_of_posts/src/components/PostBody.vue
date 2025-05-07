<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center mb-4"
        >
          <h2 v-if="!isPostEditing" class="post-title">
            #{{ post?.id }}: {{ post?.title }}
          </h2>

          <div v-if="!isPostEditing" class="is-flex">
            <span
              class="icon is-small is-right is-clickable"
              @click="initEdition"
            >
              <i
                class="fas"
                :class="isPostEditing ? 'fa-check' : 'fa-pen-to-square'"
              ></i>
            </span>
            <span
              class="icon is-small is-right has-text-danger is-clickable ml-3"
              @click="$emit('deletePost', props.post?.id)"
            >
              <i class="fas fa-trash"></i>
            </span>
          </div>
        </div>

        <p v-if="!isPostEditing" data-cy="PostBody">{{ post?.body }}</p>

        <EditPostForm
          v-if="isPostEditing"
          :editedPost="post"
          @save="savePost"
          @cancelEdit="cancelEdit"
        />

        <div class="mt-4" v-if="!isPostEditing">
          <CommentsList
          :comments="filteredComments"
          @deleteComment="deleteComment"
          />
        </div>

        <div v-if="!isPostEditing && !isCommentFormOpened" class="field mt-5">
          <button type="button" class="button is-link" @click="openCommentForm">
            Write a comment
          </button>
        </div>

        <WriteCommentForm
          v-if="isCommentFormOpened === true"
          :postId="props.post?.id"
          @addComment="addComment"
          @closeCommentForm="closeCommentForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import EditPostForm from './EditPostForm.vue'
import type { Post } from '@/types/Post'
import WriteCommentForm from './WriteCommentForm.vue'
import type { Comment } from '@/types/Comment'
import CommentsList from './CommentsList.vue'

const props = defineProps<{
  post: Post | null
  isPostEditing: boolean
}>()

const emit = defineEmits(['updatePost', 'deletePost'])

const comments = ref(JSON.parse(localStorage.getItem('comments') || '[]'))
const isCommentFormOpened = ref(false)
const isPostEditing = ref(props.isPostEditing)
const selectedPost = ref(props.post)

watch(
  () => props.post,
  (newPost, oldPost) => {
    if (newPost?.id !== oldPost?.id) {
      isPostEditing.value = false
    }
  },
)

const filteredComments = computed(() => {
  return comments.value.filter(
    (comment: Comment) => comment.postID === props.post?.id,
  )
})

const initEdition = () => {
  isPostEditing.value = true
  selectedPost.value = null
}

const savePost = (updatedPost: { title: string; body: string; id: number }) => {
  if (updatedPost !== null) {
    emit('updatePost', updatedPost)
  }
  isPostEditing.value = false
}

const openCommentForm = () => {
  isCommentFormOpened.value = true
}

const cancelEdit = () => {
  isPostEditing.value = false
  isCommentFormOpened.value = false
}

const addComment = (newComment: Comment) => {
  comments.value = [...comments.value, newComment]

  localStorage.setItem('comments', JSON.stringify(comments.value))
  isCommentFormOpened.value = false
}

const closeCommentForm = () => {
  isCommentFormOpened.value = false
}

const deleteComment = (commentId: number) => {
  comments.value = comments.value.filter(
    (comment: Comment) => comment.commentID !== commentId,
  )
  localStorage.setItem('comments', JSON.stringify(comments.value))
}
</script>

<style scoped>
.post-title {
  font-size: 24px;
  font-weight: bold;
}
</style>

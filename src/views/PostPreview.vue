<script setup lang="ts">
import { api } from '@/assets/api'
import type { Comment } from '@/assets/types/Comments'
import type { Post } from '@/assets/types/Post'
import { onMounted, ref, watch } from 'vue'
import NoCommentsYet from './NoCommentsYet.vue'
import NewComment from './NewComment.vue'
import LoaderRing from './LoaderRing.vue'

const props = defineProps<{
  post: Post
  handleEditPost: (post: Post) => void
  handleDeletePost: (postId: number) => void
}>()

const comments = ref<Comment[]>([])
const addComment = ref(false)
const isLoading = ref(true)

const handleCloseNewComment = () => {
  addComment.value = false
}

const handlerDeleteComment = (commentId: number) => {
  api.deleteComment(commentId).then(() => {
    console.log('weszło')
    return (comments.value = comments.value.filter((comment) => comment.id !== commentId))
  })
}

const handleAddComment = () => {
  addComment.value = true
}

const newComment = (data: Omit<Comment, 'id'>) => {
  api.postComments(data).then((res) => {
    comments.value.push(res)
  })

  addComment.value = false
}

onMounted(() => {
  isLoading.value = true

  api
    .getComments(props.post.id)
    .then((res) => {
      console.log('res', res)
      comments.value = res
    })
    .finally(() => {
      isLoading.value = false
    })
})

watch(
  () => props.post,
  (newPost) => {
    comments.value = []
    api.getComments(newPost.id).then((res) => {
      comments.value = res
    })
  }
)
</script>

<template>
  <template v-if="isLoading">
    <LoaderRing />
  </template>

  <template v-else>
    <div className="block">
    <div className="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ `${props.post.id}: ${props.post.title}` }}</h2>
      <div className="is-flex">
        <span
          @click="props.handleEditPost(props.post)"
          className="icon is-small is-right is-clickable"
        >
          <i className="fas fa-pen-to-square"></i>
        </span>

        <span
          @click="handleDeletePost(props.post.id)"
          className="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i className="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ props.post.body }}</p>
  </div>

  <template v-if="comments.length">
    <article v-for="comment of comments" :key="comment.id" className="message is-small">
      <div className="message-header">
        <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
        <button
          type="button"
          @click="handlerDeleteComment(comment.id)"
          className="delete is-small"
          aria-label="delete"
        ></button>
      </div>
      <div className="message-body">{{ comment.body }}</div>
    </article>
  </template>

  <NoCommentsYet v-if="!comments.length" />

  <button v-if="!addComment" type="button" @click="handleAddComment" className="button is-link">
    Write a comment
  </button>

  <NewComment
    :handleCloseNewComment="handleCloseNewComment"
    :newComment="newComment"
    :post="post"
    v-if="addComment"
  />
  </template>
</template>

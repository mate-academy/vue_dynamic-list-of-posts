<script setup>
import { getPost, deletePost } from '@/api/posts'
import Comment from './Comment.vue'
import { onMounted, ref, watch } from 'vue'
import Loader from './Loader/Loader.vue'
import { SideBarEnum } from '@/utils/SideBarModes'
import NewCommentForm from './NewCommentForm.vue'
import { getComments } from '@/api/comments'

const { postId } = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})
const posts = defineModel('posts', {
  type: Array,
})
const currentPostId = defineModel('currentPostId', {
  type: Number,
})
const sideBarMode = defineModel('sideBarMode', {
  type: String,
})
const body = defineModel('body', {
  type: String,
})
const title = defineModel('title', {
  type: String,
})
const post = ref({})
const comments = ref([])
const newCommentFormIsShown = ref(false)
const isLoading = ref(false)

const onShowPost = async () => {
  isLoading.value = true
  try {
    const [postsResponse, commentsResponse] = await Promise.all([
      getPost(postId),
      getComments(postId),
    ])
    post.value = postsResponse
    comments.value = commentsResponse
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(onShowPost)
watch(postId, onShowPost)

const onDeletePost = async () => {
  try {
    await deletePost(postId)
    posts.value = posts.value.filter((post) => post.id !== postId)
    currentPostId.value = null
    sideBarMode.value = SideBarEnum.None
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

const onEditPost = () => {
  sideBarMode.value = SideBarEnum.Edit_Post_Form
  currentPostId.value = postId
}

const openCommentForm = () => {
  newCommentFormIsShown.value = true
  currentPostId.value = postId
  body.value = post.value.body
  title.value = post.value.title
}
</script>
<template>
  <Loader v-if="isLoading" />
  <div class="block" v-if="!isLoading">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ isLoading ? '' : `#${post.id}: ${post.title}` }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="onEditPost">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="onDeletePost"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
    <div class="block" v-if="comments.length === 0">
      <p class="title is-4">No comments yet</p>
    </div>

    <template v-if="comments.length > 0 && !newCommentFormIsShown">
      <Comment
        :key="comment.id"
        v-for="comment in comments"
        :comment="comment"
        v-model:comments="comments"
      />
    </template>
    <NewCommentForm
      v-if="newCommentFormIsShown"
      v-model:sideBarMode="sideBarMode"
      v-model:newCommentFormIsShown="newCommentFormIsShown"
      v-model:comments="comments"
      :postId="postId"
    />

    <button
      v-if="!newCommentFormIsShown"
      type="button"
      class="button is-link"
      @click="openCommentForm"
    >
      Write a comment
    </button>
  </div>
</template>

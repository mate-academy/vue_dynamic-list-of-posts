<script setup>
import { ref, watch } from 'vue'

import Loader from './Loader.vue'
import CommentForm from './CommentForm.vue'

const API_URL = 'https://mate-academy.github.io/fe-students-api'

const props = defineProps({
  postId: Number,
})

const comments = ref([])
const loading = ref(false)
const error = ref(false)

const showForm = ref(false)

async function loadComments() {
  try {
    loading.value = true
    error.value = false
    showForm.value = false

    const response = await fetch(
      `${API_URL}/comments?postId=${props.postId}`,
    )

    if (!response.ok) {
      throw new Error()
    }

    comments.value = await response.json()
  } catch (err) {
    error.value = true
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function createComment(comment) {
  try {
    const response = await fetch(
      `${API_URL}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...comment,
          postId: props.postId,
        }),
      },
    )

    const newComment = await response.json()

    comments.value.push(newComment)
  } catch (err) {
    console.error(err)
  }
}

async function deleteComment(id) {
  comments.value = comments.value.filter(
    comment => comment.id !== id,
  )

  try {
    await fetch(
      `${API_URL}/comments/${id}`,
      {
        method: 'DELETE',
      },
    )
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => props.postId,
  loadComments,
  {
    immediate: true,
  },
)
</script>

<template>
  <Loader v-if="loading" />


  <div
    v-else-if="error"
    class="notification is-danger"
  >
    CommentsError
  </div>


  <div
    v-else-if="comments.length === 0"
    class="notification"
  >
    No comments
  </div>


  <div v-else>

    <article
      v-for="comment in comments"
      :key="comment.id"
      class="box"
    >

      <strong>
        {{ comment.name }}
      </strong>


      <p class="mb-3">
        {{ comment.body }}
      </p>


      <button
        class="button is-small is-danger"
        @click="deleteComment(comment.id)"
      >
        Delete
      </button>

    </article>

  </div>


  <div class="mt-5">

    <button
      v-if="!showForm"
      class="button is-link"
      @click="showForm = true"
    >
      Write a comment
    </button>


    <CommentForm
      v-else
      @create="createComment"
    />

  </div>

</template>
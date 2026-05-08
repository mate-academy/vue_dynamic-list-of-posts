<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  post: Object,
})

const emit = defineEmits([
  'save',
  'delete',
  'close',
])

const title = ref('')
const body = ref('')

const comments = ref([])
const commentsLoading = ref(false)

watch(
  () => props.post,
  async newPost => {
    title.value = newPost?.title || ''
    body.value = newPost?.body || ''

    if (newPost?.id) {
      await loadComments(newPost.id)
    }
  },
  { immediate: true }
)

async function loadComments(postId) {
  commentsLoading.value = true

  try {
    const response = await fetch(
      `https://mate-academy.github.io/fe-students-api/api/comments?postId=${postId}`
    )

    comments.value = await response.json()
  } catch (err) {
    console.error(err)
  } finally {
    commentsLoading.value = false
  }
}

function handleSave() {
  const newPost = {
    id: props.post?.id || Date.now(),
    title: title.value,
    body: body.value,
  }

  emit('save', newPost)
}

function handleDelete() {
  if (props.post) {
    emit('delete', props.post.id)
  }
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div
    class="sidebar box mt-4"
    :class="{ 'Sidebar--open': post }"
  >
    <h2 class="title is-4">
      {{ post ? 'Edit Post' : 'New Post' }}
    </h2>

    <div class="field">
      <label class="label">
        Title
      </label>

      <input
        v-model="title"
        class="input"
        placeholder="Post title"
      >
    </div>

    <div class="field">
      <label class="label">
        Body
      </label>

      <textarea
        v-model="body"
        class="textarea"
        placeholder="Post content"
      />
    </div>

    <div class="buttons mt-4">
      <button
        class="button is-success"
        @click="handleSave"
      >
        Save
      </button>

      <button
        v-if="post"
        class="button is-danger"
        @click="handleDelete"
      >
        Delete
      </button>

      <button
        class="button"
        @click="handleClose"
      >
        Cancel
      </button>
    </div>

    <hr>

    <div class="mt-5">
      <h3 class="title is-5">
        Comments
      </h3>

      <div v-if="commentsLoading">
        Loading comments...
      </div>

      <div
        v-for="comment in comments"
        :key="comment.id"
        class="box"
      >
        <p class="has-text-weight-bold">
          {{ comment.name }}
        </p>

        <p>
          {{ comment.body }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue'

const emit = defineEmits(['addPost', 'closePostForm'])

const newPostTitle = ref('')
const newPostBody = ref('')
const titleError = ref('')
const bodyError = ref('')

console.log(newPostTitle.value)

const validateForm = () => {
  let isValid = true

  if (!newPostTitle.value.trim()) {
    titleError.value = 'Title is required.'
    isValid = false
  }

  if (!newPostBody.value.trim()) {
    bodyError.value = 'Post body is required.'
    isValid = false
  }

  return isValid
}

const handleFormSubmit = () => {
  if (validateForm()) {
    const newPost = {
      id: Date.now(),
      title: newPostTitle.value,
      body: newPostBody.value,
    }

    emit('addPost', newPost)

    newPostTitle.value = ''
    newPostBody.value = ''
    titleError.value = ''
    bodyError.value = ''
  }
}

watch(newPostTitle, () => {
  if (newPostTitle.value.trim()) {
    titleError.value = ''
  }
})

watch(newPostBody, () => {
  if (newPostBody.value.trim()) {
    bodyError.value = ''
  }
})
</script>

<template>
  <div className="tile is-parent">
    <div className="tile is-child box is-success">
      <div className="block">
        <div class="block is-flex is-flex-direction-column">
          <h2 class="title">Create new post</h2>

          <form
            @submit.prevent="handleFormSubmit"
            novalidate
            class="is-flex is-flex-direction-column"
          >
            <label for="title" class="mb-2 has-text-weight-bold">Title</label>
            <div class="control has-icons-left">
              <input
                v-model="newPostTitle"
                :class="['input mb-2', titleError ? 'is-danger' : '']"
                type="text"
                name="title"
                id="title"
                placeholder="Post title"
                required
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
            <p v-if="titleError" class="help is-danger">{{ titleError }}</p>

            <label for="post" class="mb-2 has-text-weight-bold"
              >Write post body</label
            >
            <textarea
              v-model="newPostBody"
              :class="['textarea mb-2', bodyError ? 'is-danger' : '']"
              rows="4"
              name="post"
              id="post"
              placeholder="Post body"
              required
            ></textarea>
            <p v-if="bodyError" class="help is-danger">{{ bodyError }}</p>

            <div class="field is-grouped">
              <div class="control">
                <button type="submit" class="button is-link">Save</button>
              </div>
              <div class="control">
                <button
                  type="reset"
                  class="button is-link is-light"
                  @click="$emit('closePostForm')"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-danger {
  border-color: red;
}
.help.is-danger {
  color: red;
  font-size: 0.875rem;
  margin-top: 0;
  margin-bottom: 8px;
}
</style>

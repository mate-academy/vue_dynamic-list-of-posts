<script setup lang="ts">
import type { Post } from '@/assets/types/Post'
import { ref } from 'vue'

const props = defineProps<{
  post: Post
  handleUpdatePost: (title: string, body: string) => void
}>()

const newTitle = ref<string>(props.post.title)
const newBody = ref<string>(props.post.body)
const titleErr = ref(false)
const bodyErr = ref(false)

const handleSubmit = () => {
  if (newTitle.value.length === 0) {
    titleErr.value = true
  } else if (newBody.value.length === 0) {
    bodyErr.value = true
  } else {
    props.handleUpdatePost(newTitle.value, newBody.value)
  }
}
</script>

<template>
  <div class="content">
    <h2>Post editing</h2>
    <form @submit.prevent="handleSubmit">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-title">Title</label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="title"
            id="comment-author-name-title"
            placeholder="Post title"
            class="input"
            v-model="newTitle"
          /><span class="icon is-small is-left"><i class="fas fa-user fa-heading"></i></span>
        </div>
      </div>
      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Write Post Body</label>

        <div class="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Post body"
            class="textarea"
            v-model="newBody"
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control"><button type="submit" class="button is-link">Save</button></div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

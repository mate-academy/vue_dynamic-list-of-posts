<script setup lang="ts">
import { ref } from 'vue'

const postTitle = ref('')
const postBody = ref('')
const bodyErr = ref(false)
const titleErr = ref(false)

const props = defineProps<{
  handleAddPost: (title: string, body: string) => void,
  close: () => void
}>()



const clearErr = () => {
  bodyErr.value = false
  titleErr.value = false
}

const handleSubmit = () => {
  if (postTitle.value.length === 0) {
    titleErr.value = true
  }

  if (postBody.value.length === 0) {
    bodyErr.value = true
  }

  if (!titleErr.value && !bodyErr.value) {
    props.handleAddPost(postTitle.value, postBody.value)
  }
}
</script>

<template>
    <h2>Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <label class="label"
        >Title
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="postTitle"
            type="text"
            name="title"
            class="input"
            :class="{'is-danger': titleErr}"
            placeholder="Post title"
            @input="clearErr"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user fa-heading"></i>
          </span>
          <span v-if="titleErr" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon"
            ><i class="fas fa-exclamation-triangle"></i
          ></span>
        </div>
      </label>

      <p v-if="titleErr" class="help is-danger" data-cy="ErrorMessage">Title is required</p>

      <label class="label"
        >Write Post Body
        <div class="field" data-cy="BodyField">
          <div class="control">
            <textarea
            v-model="postBody"
              id="{`comment-${name}`}"
              name="name"
              placeholder="Post body"
              class="textarea"
              :class="{ 'is-danger': bodyErr }"
              @input="clearErr"
            ></textarea>
          </div>

          <p v-if="bodyErr" class="help is-danger" data-cy="ErrorMessage">
            Body is required
          </p>
        </div>
      </label>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button @click="close" type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
</template>

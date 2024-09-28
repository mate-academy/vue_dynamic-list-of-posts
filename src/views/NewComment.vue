<script setup lang="ts">
import type { Comment } from '@/assets/types/Comments'
import type { Post } from '@/assets/types/Post'
import { ref, watch } from 'vue'

const props = defineProps<{
  post: Post
  newComment: (data: Omit<Comment, 'id'>) => void
  handleCloseNewComment: () => void
}>()

watch(
  () => props.post,
  (newPost) => {
    comment.postId = newPost.id
  }
)

const nameErr = ref(false)
const emailErr = ref(false)
const bodyErr = ref(false)

const comment = {
  name: '',
  email: '',
  body: '',
  postId: props.post.id
}

const handlerResetErr = () => {
  nameErr.value = false
  emailErr.value = false
  bodyErr.value = false
}

const handleSubmit = () => {
  const test = /[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/

  if (!test.test(comment.email)) {
    emailErr.value = true
  } 

  if (comment.name.length === 0) {
    nameErr.value = true
  } 

  if (comment.body.length === 0) {
    bodyErr.value = true
  }
  
  if (!nameErr.value && !emailErr.value && !bodyErr.value) {
    props.newComment(comment)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label" for="post-title">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          @input="handlerResetErr"
          v-model="comment.name"
          type="text"
          name="name"
          id="comment-name"
          placeholder="Name Surname"
          class="input"
          :class="{ 'is-danger': nameErr }"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user" />
        </span>

        <span v-if="nameErr" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle" />
        </span>
      </div>
      <p v-if="nameErr" class="help is-danger" data-cy="ErrorMessage">Name is required</p>
    </div>

    <div class="field">
      <label class="label" for="user-email">Author Email</label>

      <div class="control has-icons-left has-icons-right">
        <input
          @input="handlerResetErr"
          v-model="comment.email"
          type="email"
          id="user-email"
          name="email"
          class="input"
          placeholder="Your email"
          :class="{ 'is-danger': emailErr }"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>

        <span v-if="emailErr" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle" />
        </span>
      </div>

      <p v-if="emailErr" class="help is-danger" data-cy="ErrorMessage">Email is required</p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="post-body"> Write Post Body </label>
      <div class="control">
        <textarea
          @input="handlerResetErr"
          id="post-body"
          name="body"
          placeholder="Comment"
          class="textarea"
          :class="{ 'is-danger': bodyErr }"
          v-model="comment.body"
        ></textarea>
      </div>

      <p v-if="bodyErr" class="help is-danger" data-cy="ErrorMessage">Comment is required</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Add Comment</button>
      </div>
      <div class="control">
        <button @click="handleCloseNewComment" type="reset" class="button is-link is-light">Cancel</button>
      </div>
    </div>
  </form>
</template>

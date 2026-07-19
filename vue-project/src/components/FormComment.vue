<script lang="ts">
import type { PropType } from 'vue'

export default {
  emits: ['update:authorName', 'update:authorEmail', 'update:postMessage'],
  props: {
    isComment: {
      type: Boolean,
    },
    authorName: {
      type: String,
    },
    authorEmail: {
      type: String,
    },
    postMessage: {
      type: String,
    },
    isLoading: {
      type: Boolean,
    },
    addComment: {
      type: Function as PropType<() => void>,
    },
    cancelComment: {
      type: Function as PropType<() => void>,
    },
    err: { type: String },
    isError: { type: Boolean },
  },
  methods: {
    onNameInput(e: Event) {
      this.$emit('update:authorName', (e.target as HTMLInputElement).value)
    },
    onEmailInput(e: Event) {
      this.$emit('update:authorEmail', (e.target as HTMLInputElement).value)
    },
    onMessageInput(e: Event) {
      this.$emit('update:postMessage', (e.target as HTMLTextAreaElement).value)
    },
  },
}
</script>
<template>
  <form class="mt-5" @submit.prevent="addComment">
    <div class="is-flex is-flex-direction-column" style="gap: 10px">
      <label for="authorName">Author Name</label>
      <input
        type="text"
        class="input"
        id="authorName"
        :value="authorName"
        @input="onNameInput"
        name="authorName"
        placeholder="Name Surname"
        required
      />

      <label for="authorEmail">Author Email</label>
      <input
        type="email"
        placeholder="Your Email"
        id="authorEmail"
        class="input"
        :value="authorEmail"
        @input="onEmailInput"
        required
      />

      <label for="postComment">Write Post Body</label>
      <textarea
        class="textarea"
        name="postMessage"
        id="postMessage"
        placeholder="Comment"
        :value="postMessage"
        @input="onMessageInput"
        required
      ></textarea>
    </div>

    <div v-if="isError">
      <span class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
      <p class="help is-danger" data-cy="ErrorMessage">{{ err }}</p>
    </div>

    <div class="mt-5">
      <button class="button is-link" type="submit" :class="isLoading ? 'is-loading' : ''">
        Add comment
      </button>
      <button class="button is-text" type="button" @click="cancelComment">Cancel</button>
    </div>
  </form>
</template>

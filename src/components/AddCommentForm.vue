<script>
import { Sidebar } from '../types/types'

export default {
  name: 'AddCommentForm',
  props: {
    errorMessage: String,
    sidebar: Sidebar
  },
  emits: ['sidebarSetShowPost', 'submitAddComment'],
  methods: {
    sidebarSetAddPost() {
      this.$emit('sidebarSetAddPost')
    }
  },
  data() {
    return {
      Sidebar
    }
  }
}
</script>

<script setup>
const email = defineModel('email')
const name = defineModel('name')
const body = defineModel('body')
</script>

<template>
  <div class="block">
    <form @submit.prevent="$emit('submitAddComment')">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-name">Author Name </label>

        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name-name"
            placeholder="Name Surname"
            class="input"
            v-model="name"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user fa-user"></i>
          </span>
        </div>
      </div>
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-email"
          >Author Email</label
        >
        <div class="control has-icons-left has-icons-right">
          <input
            type="email"
            name="email"
            id="comment-author-name-email"
            placeholder="Your Email"
            class="input"
            v-model="email"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user fa-envelope"></i>
          </span>
        </div>
      </div>
      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Write Post Body</label>
        <div class="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Comment"
            class="textarea"
            v-model="body"
            required
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add Comment</button>
          <p v-if="errorMessage !== ''" class="help is-danger">
            {{ errorMessage }}
          </p>
        </div>

        <div class="control">
          <button
            @click="$emit('sidebarSetShowPost')"
            type="reset"
            class="button is-link is-light"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>

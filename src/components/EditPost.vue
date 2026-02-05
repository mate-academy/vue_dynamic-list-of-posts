<script lang="ts">
import type { Post } from '@/types/Posts.type';
import { updatePost } from '@/api/posts';

export default {
  props: {
    selectedPost: {
      type: Object as () => Post | null,
      required: true,
    },
  },

  data() {
    return {
      postId: this.selectedPost?.id || 0,
      newTitle: this.selectedPost?.title || '',
      newBody: this.selectedPost?.body || '',
      titleError: '',
      bodyError: '',
      errorMessage: '',
    }
  },

  methods: {
    handleSubmit() {
      this.titleError = ''
      this.bodyError = ''

      if (!this.newTitle?.trim()) {
        this.titleError = 'Title is required'
      }

      if (!this.newBody?.trim()) {
        this.bodyError = 'Body is required'
      }

      if (this.titleError || this.bodyError) {
        return
      }

      const userId = localStorage.getItem('userId')
      if (!userId) return

      updatePost(this.postId, +userId, this.newTitle, this.newBody)
        .then((response) => {
          this.newTitle = ''
          this.newBody = ''
          this.$emit('close')
          this.$emit('post-updated', response.data.id)
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
    },
    handleCancel() {
      this.titleError = '';
      this.bodyError = '';
      this.newTitle = '';
      this.newBody = '';
      this.$emit('close')
    }
  },
}
</script>

<template>
  <h1 class="add-new-post__title title is-4">Post editing</h1>
  <form @submit.prevent="handleSubmit()">
    <div class="add-new-post__form">

      <!-- TITLE -->
      <div class="field">
        <label class="label">Title</label>
        <div class="control has-icons-left has-icons-right custom-input" :class="{ 'is-danger': titleError }">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <span v-if="titleError" class="icon is-small is-right">
            <i class="fas fa-exclamation-triangle"></i>
          </span>

          <input class="input" type="text" placeholder="Post Title" v-model="newTitle" @input="titleError = ''" />
        </div>
        <span v-if="titleError" class="help is-danger">{{ titleError }}</span>
      </div>

      <!-- BODY -->
      <div class="field">
        <label class="label">Write Post Body</label>
        <div class="control has-icons-left has-icons-right custom-input" :class="{ 'is-danger': bodyError }">
          <span v-if="bodyError" class="icon is-small is-right">
            <i class="fas fa-exclamation-triangle"></i>
          </span>

          <textarea class="textarea" placeholder="Post Body" v-model="newBody" @input="bodyError = ''"></textarea>
        </div>
        <span v-if="bodyError" class="help is-danger">{{ bodyError }}</span>
      </div>

    </div>

    <!-- BUTTONS -->
    <div class="field-group is-grouped mt-4">
      <div class="control">
        <button type="submit" class="button is-primary post-save-button">
          Save
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-light post-cancel-button" @click="handleCancel()">
          Cancel
        </button>
      </div>
    </div>

  </form>
</template>

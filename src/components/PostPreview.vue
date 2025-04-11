<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ currentPost?.id }}: {{ currentPost?.title }}</h2>
      <div class="is-flex">
        <span
          class="icon is-small is-right is-clickable"
          @click="updateEditPost(currentPost)"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          @click="deletePostFunction()"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ currentPost?.body }}</p>
  </div>
</template>

<script lang="ts">
import type { Post } from '@/types/post'
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'PostPreview',
  props: {
    currentPost: {
      type: Object as PropType<Post>,
    },
    deletePostFunction: {
      type: Function,
      required: true,
    },
    updateEditPost: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:isEditingModel'],
})
</script>

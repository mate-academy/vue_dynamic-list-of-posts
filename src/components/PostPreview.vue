<script>
import CommentsList from './CommentsList.vue';

export default {
  name: 'PostPreview',
  components: {
    CommentsList,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    isDeleting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'delete'],
};
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2 class="is-size-4 post-title">#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex ml-3">
        <button
          type="button"
          class="icon is-small is-right is-clickable has-background-transparent"
          aria-label="Edit post"
          :disabled="isDeleting"
          @click="$emit('edit')"
        >
          <i class="fas fa-pen-to-square"></i>
        </button>
        <button
          type="button"
          class="icon is-small is-right has-text-danger is-clickable ml-3 has-background-transparent"
          aria-label="Delete post"
          :class="{ 'is-loading': isDeleting }"
          :disabled="isDeleting"
          @click="$emit('delete', post.id)"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <p data-cy="PostBody">{{ post.body }}</p>

    <CommentsList :post-id="post.id" />
  </div>
</template>

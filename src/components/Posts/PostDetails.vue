<script setup>
import AppLoader from '../Base/AppLoader.vue';

defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
  isLoadingComments: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['delete']);
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2 class="title is-4">#{{ post.id }}: {{ post.title }}</h2>

      <div class="is-flex">
        <span class="icon is-small is-clickable">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small has-text-danger is-clickable ml-3"
          @click="emit('delete', post.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>

    <p class="mt-4" data-cy="PostBody">
      {{ post.body }}
    </p>
  </div>

  <hr />

  <div class="block">
    <p class="title is-5">Comments</p>

    <AppLoader v-if="isLoadingComments" />

    <template v-else-if="comments.length > 0">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="message is-small"
      >
        <div class="message-header">
          <a :href="'mailto:' + comment.email">
            {{ comment.name }}
          </a>
          <button class="delete is-small" aria-label="delete"></button>
        </div>
        <div class="message-body">
          {{ comment.body }}
        </div>
      </article>
    </template>

    <div v-else class="block">
      <p class="title is-4" data-cy="NoCommentsMessage">No comments yet</p>
    </div>

    <button type="button" class="button is-link mt-3">Write a comment</button>
  </div>
</template>

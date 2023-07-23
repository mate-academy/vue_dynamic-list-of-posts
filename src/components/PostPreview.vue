<script>
  export default {
    name: 'PostPreview',
    props: {
      post: Object,
    },
    data () {
      return {
        comments: [],
      }
    },
    emits: ['updatePost', 'removePost'],
  }
</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span 
          class="icon is-small is-right is-clickable"
          @click="$emit('updatePost', post.id)"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="$emit('removePost', post.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>

    <div class="block">
      <p class="title is-4">
        No comments yet
      </p>
    </div>

    <button type="button" class="button is-link">
      Write a comment
    </button>
  </div>
</template>
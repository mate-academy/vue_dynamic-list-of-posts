<script>
import CommentsList from './CommentsList.vue'

export default {
  name: 'PostPreview',
  components: { CommentsList },
  props: {
    post: Object,
    deletePost: Function,
    edit: Function,
  },
}
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': post }">
    <div class="tile is-child box is-success">
      <div class="content">
        <div class="block">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <h2>#{{ post.id }}: {{ post.title }}</h2>
            <div class="is-flex">
              <span class="icon is-small is-right is-clickable" @click="edit(post.id)">
                <i class="fas fa-pen-to-square"></i>
              </span>
              <span
                class="icon is-small is-right has-text-danger is-clickable ml-3"
                @click="deletePost(post.id)"
              >
                <i class="fas fa-trash"></i>
              </span>
            </div>
          </div>
          <p data-cy="PostBody">{{ post.body }}</p>
        </div>
        <CommentsList :post="post" />
      </div>
    </div>
  </div>
</template>
<style>
h2 {
  font-size: 1.75em;
  margin-bottom: 0.5714em;
}

.Sidebar {
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>

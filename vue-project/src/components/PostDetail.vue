<script>
import Loader from './Loader.vue';
import Comment from './Comment.vue';

export default {
  props: {
    post: Object,
    comments: Array,
    loader: Boolean,
    addCommentMenu: Boolean,
  },
  emits: ['remove', 'close', 'edit', 'write:comment', 'open-menu', 'close-menu', 'delete-comment'],
  components: {
    Loader,
    Comment,
  },
  methods: {
    addComment(event) {
      this.$emit('write:comment', { ...event, postId: this.post.id });
    }
  }
}
</script>
<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="$emit('edit', post)">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="$emit('remove')">
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
  </div>
  <div class="block">
    <Loader v-if="loader" />
    <div class="block" v-else>
      <article class="message is-small" v-if="comments.length !== 0" v-for="comment of comments" :key="comment.id">
        <div class="message-header">
          <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
          <button type="button" class="delete is-small" aria-label="delete" @click="$emit('delete-comment', comment)"></button>
        </div>
        <div class="message-body">{{ comment.body }}</div>
      </article>

      <p class="title is-4" data-cy="NoCommentsMessage" v-else>No comments yet</p>
    </div>
    <button data-cy="WriteCommentButton" type="button" class="button is-link" @click="$emit('openMenu')" v-if="!addCommentMenu">Write a comment</button>
    <Comment v-if="addCommentMenu" @closeMenu="$emit('close-menu')" @add-comment="addComment"/>
  </div>
</template>

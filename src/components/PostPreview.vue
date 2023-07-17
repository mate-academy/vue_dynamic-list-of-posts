<script>
import NoCommentsYet from './NoCommentsYet.vue';
import Comment from './Comment.vue';
import WriteComment from './WriteComment.vue';

  export default {
    name: "PostPreview",
    props: {
        postPreview: Object,
    },
    components: {
      NoCommentsYet,
      WriteComment,
      Comment,
    },
    emits: ['setStatusForm', 'deletePost', 'setPosts'],
  }
</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>#{{ postPreview.id }}: {{ postPreview.title }}</h2>
      <div class="is-flex">
        <span
          class="icon is-small is-right is-clickable"
          @click="$emit('setStatusForm', 'update')"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="$emit('deletePost', postPreview.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ postPreview.body }}</p>
  </div>
  <Comment
    v-if="postPreview.comments.length > 0"
    v-for="comment of postPreview.comments"
    :comment="comment"
    @deleteComment="$emit('setPosts', { ...postPreview, comments: postPreview.comments.filter(comment => comment.id !== $event) })"
  />
  <NoCommentsYet
    v-else
  />
  <WriteComment
    @addComment="$emit('setPosts', { ...postPreview, comments: [...postPreview.comments, $event] })"
  />
</template>
<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<script>
  import Comment from './Comment.vue';
  import CommentForm from './CommentForm.vue';
  export default {
    name: 'PostPreview',
    props: {
      post: Object,
      addingComment: Boolean,
    },
    components: {
      Comment,
      CommentForm,
    },
    data () {
      return {
        comments: [],
      }
    },
    methods: {
      handleCommentRemoving(commentId) {
        this.post.comments = this.post.comments.filter(({ id }) => id !== commentId);
      },
      handleCommentAdding(comment) {
        const newCommentId = this.post.comments.length 
          ? Math.max(...this.post.comments.map(({ id }) => id)) + 1
          : 1;
        
        this.post.comments.push({
          id: newCommentId,
          ...comment,
        });
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

    <Comment 
      v-if="post.comments?.length"
      v-for="comment of post.comments"
      :key="comment.id"
      :comment="comment"
      @removeComment="handleCommentRemoving"
    />
    <div v-else class="block">
      <p class="title is-4">
        No comments yet
      </p>
    </div>
    <CommentForm 
      v-if="addingComment"
      @close="addingComment = false" 
      @addComment="handleCommentAdding"
    />
    <button 
      v-else
      type="button" 
      class="button is-link"
      @click="addingComment = true"
    >
      Write a comment
    </button>
  </div>
</template>
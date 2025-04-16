<script>
import { addComment, deleteComment, getComments } from '../api/comments';
import Comment from './comment.vue';
import CommentForm from './CommentForm.vue';
import ErrorMessage from './ErrorMessage.vue';
import Loader from './Loader.vue';
import PostForm from './postForm.vue';

export default {
  name: 'postPreview',
  components: {
    Comment,
    CommentForm,
    PostForm,
    Loader,
    ErrorMessage,
  },
  data() {
    return {
      comments: [],
      commentForm: false,
      loading: false,
      errorMessage: false,
    }
  },
  props: {
    post: {},
  },
  emits: ['deletePost', 'handleEditing'],
  mounted() {
    this.loading = true;
    getComments(this.post.id).then(({ data }) => { this.comments = data }).catch(() => this.errorMessage = true).finally(() => this.loading = false);
  },
  methods: {
    addComment({ name, email, body }) {
      this.loading = true;
      const postId = this.post.id;
      addComment({ postId, name, email, body }).then(({ data }) => this.comments.push(data)).finally(() => this.loading = false)
    },
    deleteComment(commentId) {
      deleteComment(commentId).then(this.comments = this.comments.filter(comment => comment.id !== commentId))
    }
  },
  watch: {
    post(newPost, oldPost) {
      if (newPost !== oldPost) {
        this.loading = true;
        getComments(this.post.id).then(({ data }) => { this.comments = data }).finally(() => this.loading = false);
      }
    },
  }
}
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar--open">
    <div class="tile is-child box is-success">
      <div class="content">
        <div className="block">
          <div className="is-flex is-justify-content-space-between is-align-items-center">
            <h2>#{{ post.id }}: {{ post.title }}</h2>
            <div className="is-flex">
              <span className="icon is-small is-right is-clickable" @click="$emit('handleEditing')">
                <i className="fas fa-pen-to-square"></i>
              </span>
              <span className="icon is-small is-right has-text-danger is-clickable ml-3"
                @click="$emit('deletePost', post.id)">
                <i className="fas fa-trash"></i>
              </span>
            </div>
          </div>
          <p data-cy="PostBody">{{ post.body }}</p>
        </div>
        <div className="block" v-if="!commentForm">
          <Loader v-if="loading" />
          <ErrorMessage v-if="errorMessage" :props="'comments'" @close="errorMessage = false"/>
          <Comment v-else v-for="comment of comments" :comment="comment" :key="comment.id" @deleteComment="deleteComment" />
          <div className="block" v-if="comments.length === 0 && !loading">
            <p className="title is-4">No comments yet</p>
          </div>
          <button type="button" className="button is-link" @click="commentForm = true">Write a comment</button>
        </div>
        <div className="block" v-if="commentForm">
          <CommentForm @close="commentForm = false" @addComment="addComment" :loading="loading" />
        </div>
      </div>
    </div>
  </div>
</template>

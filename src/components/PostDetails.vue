<script>
import { getCommentsOfPost, createNewComment } from '../../api/comments';
import AppLoader from './AppLoader.vue';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
export default {
  name: 'PostDetails',
  data() {
    return {
      isLoading: true,
      postComments: [],
      isWritingComment: false,
    }
  },
  emits: ['showForm', 'deletePost'],
  props: {
    post: Object,
  },
  watch: {
    post() {
      this.getComments();
    }
  },
  methods: {
    getComments(){
      getCommentsOfPost(this.post.id)
        .then((response) => this.postComments = response.data)
        .finally(() => this.isLoading = false);
    },
    createComment(data) {
      this.closeCommentFrom();

      createNewComment({ ...data, postId: this.post.id })
        .then(this.getComments);
    },
    closeCommentFrom() {
      this.isWritingComment = false;
    }
  },
  mounted() {
    this.getComments();
  },
  components: { AppLoader, CommentList, CommentForm }
}
</script>

<template>
  <div className="block">
    <div
      className="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h3 class="title is-3">#{{ post.id }}: {{ post.title }}</h3>
      <div className="is-flex">
        <span 
          className="icon is-small is-right is-clickable" 
          @click="this.$emit('showForm', this.post)"
        >
          <i className="fas fa-edit"></i>
        </span>
        <span
          className="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="this.$emit('deletePost')"
        >
          <i className="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>

    <AppLoader v-if="isLoading" />

    <div className="block" v-if="!isLoading && postComments.length === 0">
      <p className="title is-4">No comments yet</p>
    </div>

    <CommentList 
      :postComments="postComments"
      @loadComments="getComments"
      v-if="!isWritingComment"
    />

    <CommentForm 
      @createComment="createComment"
      @closeForm="closeCommentFrom" 
      v-else
    />

    <button 
      type="button" 
      className="button is-link"
      @click="this.isWritingComment=true"
      v-if="!isWritingComment"
    >
      Write a comment
    </button>
  </div>
</template>

<style>
.fa-pen-to-square:before {
  content: '';
  display: block;
  height: 16px;
  width: 16p;
}
</style>
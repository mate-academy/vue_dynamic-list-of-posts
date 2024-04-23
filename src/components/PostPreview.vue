<script>
  import { deleteComment, getComments } from '@/api/comments';
  import AddComment from './AddComment.vue';
  import CommentComponent from './CommentComponent.vue';
  import MessageComponent from './MessageComponent.vue';
  import NoCommentsYet from './NoCommentsYet.vue';
  import PostLoader from './PostLoader.vue';

  export default {
    name: 'PostPreview',
    components: {
      AddComment,
      MessageComponent,
      PostLoader,
      NoCommentsYet,
      CommentComponent,
    },
    emits: ['delete', 'edit-post'],
    props: {
      post: Object,
    },
    data() {
      return {
        loading: false,
        errorMessage: '',
        comments: [],
        visibleComments: [],
        addCommentsIsOpen: false,
        authorName: '',
        authorEmail: '',
      };
    },
    mounted() {
      this.errorMessage = '';
      this.loading = true;
      getComments(this.post.id)
        .then(({ data }) => {
          this.comments = data;
          this.visibleComments = data;
        })
        .catch(() => {
          this.errorMessage = 'Unable to load comments';
        })
        .finally(() => {
          this.loading = false;
        });
    },
    methods: {
      toggleAddCommentsIsOpen() {
        this.addCommentsIsOpen = !this.addCommentsIsOpen;
      },
      handlerAddComment(event) {
        this.comments = [...this.comments, event];
        this.visibleComments = this.comments;
        this.authorName = event.name;
        this.authorEmail = event.email;
      },
      handlerDeleteComment(commentId) {
        this.errorMessage = '';
        this.visibleComments = this.comments
          .filter(comment => comment.id !== commentId);
        deleteComment(commentId)
          .then(() => {
            this.comments = this.visibleComments;
          })
          .catch(() => {
            this.errorMessage = 'Unable to delete comments';
            this.visibleComments = this.comments;
          })
      },
    }
  }
</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>{{ `#${post.id}: ${post.title}` }}</h2>
      <div class="is-flex">
        <span 
          class="icon is-small is-right is-clickable"
          @click="$emit('edit-post')"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="$emit('delete')"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>

    <MessageComponent
      :active="errorMessage !== ''"
      @hide="errorMessage = ''"
    >
      <p>{{ errorMessage }}</p>
    </MessageComponent>

    <template v-if="!addCommentsIsOpen">
      <PostLoader v-if="loading" />

      <template v-else>
        <template v-if="!errorMessage">
          <CommentComponent
            v-for="comment of visibleComments" 
            :key="comment.id"
            :comment="comment"
            @delete="handlerDeleteComment"
          />
        </template>

        <NoCommentsYet
          :text="'comments'"
          v-if="!errorMessage && visibleComments.length === 0"
        />

        <button 
          type="button" 
          class="button is-link"
          @click="toggleAddCommentsIsOpen"
          v-if="!errorMessage"
        >
          Write a comment
        </button>
      </template>
    </template>

    <AddComment
      :postId="post.id"
      :name="this.authorName"
      :email="this.authorEmail"
      @close="toggleAddCommentsIsOpen"
      @add-comment="handlerAddComment"
      @error="errorMessage = $event"
      v-if="addCommentsIsOpen"
    />
  </div>
</template>
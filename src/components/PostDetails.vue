<script>
import { deleteComment, getPostComments } from '@/api/comments';
import Comment from './Comment.vue';
import NoCommentsYet from './NoCommentsYet.vue';
import Loader from './Loader.vue';
import Message from './Message.vue';
import WriteCommentBtn from './WriteCommentBtn.vue';
import AddComment from './AddComment.vue';

export default {
  name: 'PostDetails',
  components: {
    Comment,
    NoCommentsYet,
    Loader,
    Message,
    WriteCommentBtn,
    AddComment,
  },
  data() {
    return {
      commentsList: [],
      isCommentsLoading: false,
      errorMessage: '',
      isWritingComment: false,
    };
  },
  computed: {
    currentPost() {
      return this.$store.state.currentPost;
    },
  },
  watch: {
    currentPost: {
      immediate: true,
      deep: true,
      handler(newPost) {
        if (newPost && newPost.id) {
          this.isWritingComment = false;
          this.errorMessage = '';
          this.downloadCommentsList();
        } else {
          this.commentsList = [];
          this.errorMessage = '';
        }
      },
    },
  },
  methods: {
    downloadCommentsList() {
      this.isCommentsLoading = true;
      this.errorMessage = '';

      getPostComments(this.currentPost.id)
        .then(({ data }) => {
          this.commentsList = data;
        })
        .catch((error) => {
          console.error('Error loading comments:', error);
          this.errorMessage = "Couldn't load comments";
        })
        .finally(() => {
          this.isCommentsLoading = false;
        });
    },

    addNewComment(comment) {
      this.commentsList.push(comment);
      this.isWritingComment = false;
    },

    removeComment(commentId) {
      this.errorMessage = '';
      deleteComment(commentId)
        .then(({ data }) => {
          if (data === 1) {
            const index = this.commentsList.findIndex(
              (comment) => comment.id === commentId,
            );
            if (index !== -1) {
              this.commentsList.splice(index, 1);
            }
          } else {
            console.warn(
              'Comment deletion might not be fully successful. API response:',
              data,
            );
            this.errorMessage = 'Comment deletion failed on server.';
          }
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
          this.errorMessage = "Couldn't delete the comment";
        })
        .finally(() => {});
    },

    showWriteComment() {
      this.isWritingComment = true;
    },

    cancelWritingComment() {
      this.isWritingComment = false;
      this.errorMessage = '';
    },
  },
};
</script>

<template>
  <Loader v-if="!currentPost && isCommentsLoading" size="large" centered />
  <div v-else-if="currentPost" class="content">
    <h3 class="title is-4">{{ currentPost.title }}</h3>
    <p>{{ currentPost.body }}</p>
    <div class="buttons">
      <button
        class="button is-link"
        @click="$store.commit('setInSidebar', 'updatingPost')"
      >
        Edit Post
      </button>
    </div>

    <hr />
    <h4 class="title is-5">Comments</h4>

    <Loader v-if="isCommentsLoading" centered />

    <template v-else-if="errorMessage === ''">
      <template v-if="!isWritingComment">
        <template v-if="commentsList.length !== 0">
          <Comment
            v-for="comment of commentsList"
            :key="comment.id"
            :comment="comment"
            @delete-comment="removeComment"
          />
        </template>
        <NoCommentsYet v-else />
        <WriteCommentBtn @click="showWriteComment" />
      </template>

      <AddComment
        v-else
        :post-id="currentPost.id"
        @cancel="cancelWritingComment"
        @update-comments-list="addNewComment"
      />
    </template>

    <Message
      v-if="errorMessage !== ''"
      type="is-danger"
      icon="fas fa-exclamation-triangle"
    >
      <template #head>
        <p>Error</p>
      </template>
      <p>{{ errorMessage }}</p>
    </Message>
  </div>
  <div v-else class="content">
    <p class="title is-4">Select a post from the list.</p>
  </div>
</template>

<style></style>

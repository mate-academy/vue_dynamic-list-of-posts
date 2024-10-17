<script>
import { deleteComment, getPostComments } from "@/api/comments";
import Comment from "./Comment.vue";
import PostPreview from "./PostPreview.vue";
import NoCommentsYet from "./NoCommentsYet.vue";
import Loader from "./Loader.vue";
import Message from "./Message.vue";
import WriteCommentBtn from "./WriteCommentBtn.vue";
import AddComment from "./AddComment.vue";

export default {
  name: "PostDetails",
  components: {
    PostPreview,
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
      errorMessage: "",
      isWritingComment: false,
    };
  },
  computed: {
    currentPost() {
      return this.$store.state.currentPost;
    }
  },
  watch: {
    currentPost: {
      immediate: true,
      deep: true,
      handler() {
        this.isWritingComment = false;
        this.downloadCommentsList();
      },
    },
  },
  methods: {
    downloadCommentsList() {
      this.isCommentsLoading = true;

      getPostComments(this.currentPost.id)
        .then(({ data }) => {
          this.commentsList = data;
        })
        .catch(() => {
          this.errorMessage = "Didn't able to download comments";
        })
        .finally(() => {
          this.isCommentsLoading = false;
        });
    },

    removeComment(commentId) {
      deleteComment(commentId)
        .then(({ data }) => {
          if (data === 1) {
            const index = this.commentsList.findIndex(
              (comment) => comment.id === commentId
            );
            this.commentsList.splice(index, 1);
          }
        })
        .catch(() => {
          this.errorMessage = "Didn't able to delete comments";
        })
        .finally(() => {});
    },

    showWriteComment() {
      this.isWritingComment = true;
    },

    cancelWritingComment() {
      this.isWritingComment = false;
    },
  },
};
</script>

<template>
  <PostPreview />
  <Loader v-if="isCommentsLoading" />
  <template v-else-if="errorMessage === ''">
    <template v-if="!isWritingComment">
      <Comment
        v-if="commentsList.length !== 0"
        v-for="comment of commentsList"
        :key="comment.id"
        :comment="comment"
        @delateComment="removeComment"
      />
      <NoCommentsYet v-else />
      <WriteCommentBtn @click="showWriteComment" />
    </template>
    <template v-else>
      <AddComment
        @cancel="cancelWritingComment"
        :postId="currentPost.id"
        @updateCommentsList="commentsList.push($event)"
      />
    </template>
  </template>

  <Message v-if="errorMessage !== ''">
    <template #head>
      <p>Error</p>
    </template>
    {{ console.log("errorMessage", errorMessage) }}
    <p>{{ errorMessage }}</p>
  </Message>
</template>

<style></style>

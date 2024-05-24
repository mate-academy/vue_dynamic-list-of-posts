<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': showNewPostForm || showPostPreview }"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <AddPost
          v-if="showNewPostForm"
          :userId="userId"
          @close-form="handleCloseForm"
          @post-added="handlePostAdded"
        />
        <EditPost
          v-if="isEditing"
          :post="openedPost"
          @post-edited="handlePostEdited"
          @close-edit-form="handleCloseEditForm"
        />
        <PostPreview
          v-if="showPostPreview && !isEditing && !showNewPostForm"
          :post="openedPost"
          @post-deleted="handleDeletePost"
          @post-editing="handlePostEditing"
        />
        <AddComment
          v-if="showAddCommentForm"
          :postId="openedPost.id"
          @close-form="handleCloseCommentForm"
          @comment-added="handleAddComment"
        />
        <PostLoader v-if="isLoading" />
        <CommentList
          v-if="
            !isLoading &&
            comments.length &&
            showPostPreview &&
            !isEditing &&
            !showNewPostForm &&
            !showAddCommentForm
          "
          :comments="comments"
          @comment-delete="handleDeleteComment"
        />
        <NoCommentsYet
          v-if="
            !isLoading &&
            !comments.length &&
            !isEditing &&
            !showNewPostForm &&
            !showAddCommentForm &&
            showPostPreview
          "
        />
        <WriteCommentBtn
          v-if="
            !isLoading && showPostPreview && !isEditing && !showNewPostForm && !showAddCommentForm
          "
          @click="handleShowCommentForm"
        />
        <p class="help is-danger" v-if="!isLoading && errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AddPost from '../AddPost.vue';
import PostPreview from '../PostPreview.vue';
import CommentList from '../Comment.vue';
import PostLoader from '../PostLoader.vue';
import { getComments } from '@/api/comments';
import NoCommentsYet from '../NoCommentsYet.vue';
import EditPost from '../EditPost.vue';
import WriteCommentBtn from '../WriteCommentBtn.vue';
import AddComment from '../AddComment.vue';

export default {
  name: 'AppSidebar',
  props: {
    showNewPostForm: Boolean,
    showPostPreview: Boolean,
    showAddCommentForm: Boolean,
    userId: Number,
    openedPost: Object,
    isEditing: Boolean
  },
  components: {
    AddPost,
    PostPreview,
    CommentList,
    PostLoader,
    NoCommentsYet,
    EditPost,
    WriteCommentBtn,
    AddComment
  },
  data() {
    return {
      comments: [],
      isLoading: false,
      errorMessage: ''
    };
  },
  watch: {
    openedPost(newPost, oldPost) {
      if (newPost && newPost.id !== oldPost.id && this.showPostPreview) {
        this.loadComments();
      }
    }
  },
  mounted() {
    if (this.openedPost && this.showPostPreview) {
      this.loadComments();
    }
  },
  methods: {
    loadComments() {
      this.errorMessage = '';
      this.isLoading = true;
      getComments(this.openedPost.id)
        .then(({ data }) => {
          this.comments = data;
        })
        .catch(() => {
          this.isLoading = false;
          this.errorMessage = 'Unable to load comments';
        })
        .finally(() => (this.isLoading = false));
    },
    handleCloseForm() {
      this.$emit('close-new-post-form');
    },
    handleCloseEditForm() {
      this.$emit('close-edit-form');
      this.loadComments();
    },
    handlePostAdded(post) {
      this.$emit('post-added', post);
    },
    handleDeletePost(postId) {
      this.$emit('post-deleted', postId);
    },
    handlePostEdited(post) {
      this.$emit('post-edited', post);
      this.loadComments();
    },
    handlePostEditing(post) {
      this.$emit('post-edit', post);
    },
    handleDeleteComment(commentId) {
      this.comments = this.comments.filter((c) => c.id !== commentId);
    },
    handleShowCommentForm() {
      this.$emit('show-add-comment-form');
    },
    handleCloseCommentForm() {
      this.$emit('close-add-comment-form');
    },
    handleAddComment(comment) {
      this.comments.push(comment);
    }
  }
};
</script>

<style>
.Sidebar {
  overflow: hidden;
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

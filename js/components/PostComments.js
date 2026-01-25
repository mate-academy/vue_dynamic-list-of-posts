// PostComments Component
const PostComments = {
  name: 'PostComments',
  components: {
    Loader,
    Comment,
    CommentForm,
  },
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      isLoading: false,
      loadError: '',
      showCommentForm: false,
      deleteError: '',
    };
  },
  watch: {
    postId: {
      immediate: true,
      handler() {
        this.loadComments();
        this.showCommentForm = false;
      },
    },
  },
  methods: {
    async loadComments() {
      this.isLoading = true;
      this.loadError = '';

      try {
        this.comments = await api.getComments(this.postId);
      } catch (error) {
        this.loadError = 'Failed to load comments';
      } finally {
        this.isLoading = false;
      }
    },
    async handleDeleteComment(commentId) {
      // Eliminar inmediatamente de la UI
      const commentIndex = this.comments.findIndex(c => c.id === commentId);
      const deletedComment = this.comments[commentIndex];
      this.comments.splice(commentIndex, 1);
      this.deleteError = '';

      try {
        await api.deleteComment(commentId);
      } catch (error) {
        // Si falla, restaurar el comentario
        this.comments.splice(commentIndex, 0, deletedComment);
        this.deleteError = 'Failed to delete comment. Please try again.';
      }
    },
    handleCommentAdded(newComment) {
      this.comments.push(newComment);
    },
    toggleCommentForm() {
      this.showCommentForm = !this.showCommentForm;
    },
  },
  template: `
    <div class="block">
      <div v-if="isLoading">
        <Loader />
      </div>

      <div v-else-if="loadError" class="notification is-danger">
        {{ loadError }}
      </div>

      <div v-else>
        <div v-if="comments.length === 0" class="block">
          <p class="title is-4">No comments yet</p>
        </div>

        <div v-else>
          <div v-if="deleteError" class="notification is-danger is-light mb-4">
            {{ deleteError }}
          </div>

          <Comment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @delete="handleDeleteComment"
          />
        </div>

        <div v-if="!showCommentForm" class="block">
          <button 
            type="button" 
            class="button is-link"
            @click="toggleCommentForm"
          >
            Write a comment
          </button>
        </div>

        <div v-else class="block">
          <CommentForm
            :postId="postId"
            @commentAdded="handleCommentAdded"
          />
        </div>
      </div>
    </div>
  `
};

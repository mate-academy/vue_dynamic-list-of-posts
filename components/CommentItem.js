// CommentItem.js - Окремий компонент для коментаря
const CommentItem = {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  emits: ['comment-deleted', 'comment-delete-error'],
  data() {
    return {
      isDeleting: false,
      deleteError: null
    };
  },
  methods: {
    async deleteComment() {
      this.isDeleting = true;
      this.deleteError = null;

      try {
        const response = await fetch(`https://mate.academy/students-api/comments/${this.comment.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Emit success event
        this.$emit('comment-deleted', this.comment.id);
        
      } catch (error) {
        console.error('Error deleting comment:', error);
        this.deleteError = 'Failed to delete comment. Please try again.';
        this.$emit('comment-delete-error', { commentId: this.comment.id, error });
      } finally {
        this.isDeleting = false;
      }
    },

    retryDelete() {
      this.deleteError = null;
      this.deleteComment();
    }
  },
  template: `
    <article class="message is-small">
      <div class="message-header">
        <a :href="\`mailto:\${comment.email}\`">{{ comment.name }}</a>
        <button 
          type="button" 
          class="delete is-small" 
          aria-label="delete"
          @click="deleteComment"
          :class="{ 'is-loading': isDeleting }"
        ></button>
      </div>
      
      <div class="message-body">
        {{ comment.body }}
        
        <!-- Delete Error with Retry Button -->
        <div v-if="deleteError" class="notification is-danger is-small mt-2">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <span>{{ deleteError }}</span>
            <button 
              type="button" 
              class="button is-small is-danger is-light"
              @click="retryDelete"
            >
              Retry Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  `
};

export default CommentItem;

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <button class="delete is-large" @click="$emit('close')"></button>

          <!-- Edit Post Form -->
          <div v-if="editingPost">
            <h2 class="title is-4">
              {{ editingPost.id ? "Edit Post" : "Create Post" }}
            </h2>

            <!-- Title Field -->
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input
                  v-model="editingPost.title"
                  class="input"
                  :class="{ 'is-danger': postErrors.title && postSubmitted }"
                  type="text"
                  placeholder="Post title"
                  @input="clearPostError('title')"
                />
              </div>
              <p
                v-if="postErrors.title && postSubmitted"
                class="help is-danger"
              >
                {{ postErrors.title }}
              </p>
            </div>

            <!-- Content Field -->
            <div class="field">
              <label class="label">Content</label>
              <div class="control">
                <textarea
                  v-model="editingPost.body"
                  class="textarea"
                  :class="{ 'is-danger': postErrors.body && postSubmitted }"
                  placeholder="Post content"
                  @input="clearPostError('body')"
                ></textarea>
              </div>
              <p v-if="postErrors.body && postSubmitted" class="help is-danger">
                {{ postErrors.body }}
              </p>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button
                  class="button is-primary"
                  @click="validateAndSubmitPost"
                >
                  {{ editingPost.id ? "Update" : "Create" }}
                </button>
              </div>
              <div class="control">
                <button class="button is-light" @click="$emit('cancel-edit')">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Post Preview -->
          <div v-else-if="currentPost">
            <h2 class="title is-4">{{ currentPost.title }}</h2>
            <p class="content">{{ currentPost.body }}</p>

            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info" @click="$emit('edit-post')">
                  Edit
                </button>
              </div>
              <div class="control">
                <button
                  class="button is-danger"
                  @click="$emit('delete-post', currentPost.id)"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section">
              <h3 class="title is-5">Comments</h3>

              <!-- Loader for comments -->
              <Loader v-if="commentsLoading" />

              <!-- Error message for comments -->
              <div v-else-if="commentsError" class="notification is-danger">
                {{ commentsError }}
              </div>

              <!-- No comments message -->
              <div
                v-else-if="comments.length === 0"
                class="notification is-warning"
              >
                No comments yet
              </div>

              <!-- Comments list -->
              <div v-else>
                <Comment
                  v-for="comment in comments"
                  :key="comment.id"
                  :comment="comment"
                  @delete-comment="handleDeleteComment"
                />
              </div>

              <!-- Write comment button or form -->
              <div v-if="!showCommentForm" class="mt-4">
                <WriteCommentBtn @write-comment="showCommentForm = true" />
              </div>

              <!-- Comment form -->

              <CommentForm
                v-else
                :postId="currentPost.id"
                :addSucceededKey="addSucceededKey"
                @add-comment="handleAddComment"
                @cancel="showCommentForm = false"
              />
            </div>
          </div>

          <!-- Create Post Form -->

          <div v-else>
            <h2 class="title is-4">Create New Post</h2>

            <!-- Title Field -->

            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input
                  v-model="newPost.title"
                  class="input"
                  :class="{ 'is-danger': postErrors.title && postSubmitted }"
                  type="text"
                  placeholder="Post title"
                  @input="clearPostError('title')"
                />
              </div>
              <p
                v-if="postErrors.title && postSubmitted"
                class="help is-danger"
              >
                {{ postErrors.title }}
              </p>
            </div>

            <!-- Content Field -->

            <div class="field">
              <label class="label">Content</label>
              <div class="control">
                <textarea
                  v-model="newPost.body"
                  class="textarea"
                  :class="{ 'is-danger': postErrors.body && postSubmitted }"
                  placeholder="Post content"
                  @input="clearPostError('body')"
                ></textarea>
              </div>
              <p v-if="postErrors.body && postSubmitted" class="help is-danger">
                {{ postErrors.body }}
              </p>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button
                  class="button is-primary"
                  @click="validateAndCreatePost"
                >
                  Create
                </button>
              </div>
              <div class="control">
                <button class="button is-light" @click="$emit('close')">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Loader from "./Loader.vue";
import Comment from "./Comment.vue";
import CommentForm from "./CommentForm.vue";
import WriteCommentBtn from "./WriteCommentBtn.vue";
import { getComments, createComment, deleteComment } from "../api/posts";

export default {
  name: "Sidebar",
  components: {
    Loader,
    Comment,
    CommentForm,
    WriteCommentBtn,
  },
  props: {
    isOpen: Boolean,
    currentPost: Object,
    editingPost: Object,
  },
  emits: [
    "close",
    "create-post",
    "update-post",
    "delete-post",
    "edit-post",
    "cancel-edit",
  ],
  setup(props, { emit }) {
    const newPost = ref({
      title: "",
      body: "",
      userId: 1,
    });

    const comments = ref([]);
    const commentsLoading = ref(false);
    const commentsError = ref(null);
    const showCommentForm = ref(false);
    const addSucceededKey = ref(0); // New success signal

    const postErrors = ref({
      title: "",
      body: "",
    });
    const postSubmitted = ref(false);

    // Load comments when currentPost changes
    watch(
      () => props.currentPost,
      async (newPost) => {
        if (newPost && newPost.id) {
          await loadComments(newPost.id);
        }
      }
    );

    // Reset form when sidebar closes
    watch(
      () => props.isOpen,
      (isOpen) => {
        if (!isOpen) {
          newPost.value = { title: "", body: "", userId: 1 };
          comments.value = [];
          commentsError.value = null;
          showCommentForm.value = false;
          postErrors.value = { title: "", body: "" };
          postSubmitted.value = false;
          addSucceededKey.value = 0; // Reset success key
        }
      }
    );

    const validatePost = (postData) => {
      postErrors.value = { title: "", body: "" };
      let isValid = true;

      if (!postData.title.trim()) {
        postErrors.value.title = "Title is required";
        isValid = false;
      }

      if (!postData.body.trim()) {
        postErrors.value.body = "Content is required";
        isValid = false;
      }

      return isValid;
    };

    const clearPostError = (field) => {
      if (postErrors.value[field]) {
        postErrors.value[field] = "";
      }
    };

    const validateAndCreatePost = () => {
      postSubmitted.value = true;
      if (validatePost(newPost.value)) {
        emit("create-post", newPost.value);
      }
    };

    const validateAndSubmitPost = () => {
      postSubmitted.value = true;
      if (validatePost(props.editingPost)) {
        emit(
          props.editingPost.id ? "update-post" : "create-post",
          props.editingPost
        );
      }
    };

    const loadComments = async (postId) => {
      commentsLoading.value = true;
      commentsError.value = null;

      try {
        comments.value = await getComments(postId);
      } catch (err) {
        commentsError.value = "Failed to load comments";
        console.error("Error loading comments:", err);
      } finally {
        commentsLoading.value = false;
      }
    };

    const handleAddComment = async (commentData) => {
      try {
        const newComment = await createComment(commentData);
        comments.value.push(newComment);

        // Increment success key to signal successful addition
        addSucceededKey.value += 1;

        // FORM REMAINS OPEN - don't set showCommentForm.value = false
      } catch (err) {
        console.error("Error adding comment:", err);
        commentsError.value = "Failed to add comment";
      }
    };

    const handleDeleteComment = async (commentId) => {
      // Optimistic update - remove immediately
      const commentIndex = comments.value.findIndex((c) => c.id === commentId);
      if (commentIndex !== -1) {
        const deletedComment = comments.value.splice(commentIndex, 1)[0];

        try {
          await deleteComment(commentId);
        } catch (err) {
          // Re-add comment if deletion fails
          comments.value.splice(commentIndex, 0, deletedComment);
          console.error("Error deleting comment:", err);
          commentsError.value = "Failed to delete comment";
        }
      }
    };

    return {
      newPost,
      comments,
      commentsLoading,
      commentsError,
      showCommentForm,
      addSucceededKey,
      postErrors,
      postSubmitted,
      validateAndCreatePost,
      validateAndSubmitPost,
      clearPostError,
      handleAddComment,
      handleDeleteComment,
    };
  },
};
</script>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

@media (min-width: 769px) {
  .Sidebar {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .Sidebar--open {
    max-width: 50%;
  }
}

.delete {
  position: absolute;
  top: 10px;
  right: 10px;
}

.content {
  position: relative;
  padding-top: 2rem;
}

.comments-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #dbdbdb;
}

.mt-4 {
  margin-top: 1rem;
}
</style>

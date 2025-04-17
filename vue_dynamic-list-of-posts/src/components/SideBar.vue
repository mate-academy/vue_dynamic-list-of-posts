<template>
  <div :class="['SideBar', { 'SideBar--open': isOpen }]">
    <div class="tile is-child box is-success">
      <div class="content">
        <!-- Post Creation Mode -->
        <div v-if="!post && !isEditMode">
          <h2>Create new post</h2>
          <form @submit.prevent="createPost">
            <div class="field">
              <label class="label" for="post-title">Title</label>
              <div class="control">
                <input
                  id="post-title"
                  type="text"
                  class="input"
                  placeholder="Enter post title"
                  v-model="newPost.title"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label" for="post-body">Body</label>
              <div class="control">
                <textarea
                  id="post-body"
                  class="textarea"
                  placeholder="Enter post body"
                  v-model="newPost.body"
                  required
                ></textarea>
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button type="submit" class="button is-link">Create</button>
              </div>
              <div class="control">
                <button type="button" class="button is-light" @click="$emit('close')">Cancel</button>
              </div>
            </div>
          </form>
        </div>

        <!-- Loader -->
        <AppLoader v-if="loading" />
        <!-- Post Details Mode -->
        <div v-else-if="post && !isEditMode && !loading">

          <div class="block">
            <h2>#{{ post.id }}: {{ post.title }}</h2>
            <p>{{ post.body }}</p>
          </div>

          <div class="is-flex is-justify-content-space-between is-align-items-center mt-3">
            <!-- Edit Button -->
            <span
              class="icon is-small is-right is-clickable"
              @click="enterEditMode"
              title="Edit Post"
            >
              <i class="fas fa-pen-to-square"></i>
            </span>

            <!-- Delete Button -->
            <span
              class="icon is-small is-right has-text-danger is-clickable ml-3"
              @click="deletePost"
              title="Delete Post"
            >
              <i class="fas fa-trash"></i>
            </span>
          </div>

          <div class="block">
            <!-- Comments Section -->
            <div v-if="post.comments && post.comments.length > 0">
              <article
                v-for="(comment, index) in post.comments"
                :key="index"
                class="message is-small"
                data-cy="Comment"
              >
                <div class="message-header">
                  <a
                    :href="'mailto:' + comment.email"
                    data-cy="CommentAuthor"
                  >
                    {{ comment.name }}
                  </a>
                  <button
                    data-cy="CommentDelete"
                    type="button"
                    class="delete is-small"
                    aria-label="delete"
                    @click="deleteComment(index)"
                  >
                    delete button
                  </button>
                </div>
                <div class="message-body" data-cy="CommentBody">
                  {{ comment.body }}
                </div>
              </article>
            </div>
            <p v-else class="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>

            <!-- Write Comment Button -->
            <div v-if="!isCommentFormVisible">
              <button
                data-cy="WriteCommentButton"
                type="button"
                class="button is-link"
                @click="toggleCommentForm"
              >
                Write a comment
              </button>
            </div>

            <!-- Comment Form -->
            <form v-else @submit.prevent="addComment">
              <div class="field" data-cy="NameField">
                <label class="label" for="comment-author-name-name">Author Name</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    type="text"
                    name="name"
                    id="comment-author-name-name"
                    placeholder="Name Surname"
                    class="input"
                    v-model="newComment.name"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
              </div>

              <div class="field" data-cy="NameField">
                <label class="label" for="comment-author-name-email">Author Email</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    type="email"
                    name="email"
                    id="comment-author-name-email"
                    placeholder="Your Email"
                    class="input"
                    v-model="newComment.email"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
              </div>

              <div class="field" data-cy="BodyField">
                <label class="label" for="comment-body">Write Comment</label>
                <div class="control">
                  <textarea
                    id="comment-body"
                    name="body"
                    placeholder="Comment"
                    class="textarea"
                    v-model="newComment.body"
                    required
                  ></textarea>
                </div>
              </div>

              <div class="field is-grouped">
                <div class="control">
                  <button type="submit" class="button is-link">Add Comment</button>
                </div>
                <div class="control">
                  <button
                    type="button"
                    class="button is-link is-light"
                    @click="toggleCommentForm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Edit Post Mode -->
        <div v-else-if="isEditMode">
          <h2>Post editing</h2>
          <form @submit.prevent="savePost">
            <div class="field" data-cy="NameField">
              <label class="label" for="edit-post-title">Title</label>
              <div class="control has-icons-left has-icons-right">
                <input
                  type="text"
                  name="title"
                  id="edit-post-title"
                  placeholder="Post title"
                  class="input"
                  v-model="localPost.title"
                  required
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-user fa-heading"></i>
                </span>
              </div>
            </div>

            <div class="field" data-cy="BodyField">
              <label class="label" for="edit-post-body">Write Post Body</label>
              <div class="control">
                <textarea
                  id="edit-post-body"
                  name="body"
                  placeholder="Post body"
                  class="textarea"
                  v-model="localPost.body"
                  required
                ></textarea>
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button type="submit" class="button is-link">Save</button>
              </div>
              <div class="control">
                <button
                  type="button"
                  class="button is-link is-light"
                  @click="exitEditMode"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLoader from './loader/AppLoader.vue';

export default {
  name: 'SideBar',
  components: {
    AppLoader,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    post: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isEditMode: false, // Controls whether the sidebar is in "Edit Post" mode
      isCommentFormVisible: false, // Controls visibility of the comment form
      localPost: null, // Local copy of the post for editing
      newPost: {
        title: '',
        body: '',
      },
      newComment: {
        name: '',
        email: '',
        body: '',
      },
      loading: false,
    };
  },
  watch: {
    post: {
      immediate: true,
      handler(newPost) {
        if (newPost) {
          this.loading = true; // Start loading
          setTimeout(() => {
            this.localPost = { ...newPost, comments: [...(newPost.comments || [])] };
            this.loading = false; // Stop loading after content is "loaded"
          }, 1000); // Simulate a 1-second delay
        } else {
          this.localPost = null;
        }
      },
    },
  },
  methods: {
    createPost() {
      if (this.newPost.title.trim() && this.newPost.body.trim()) {
        this.$emit('create-post', { ...this.newPost });
        this.newPost = { title: '', body: '' };
        this.$emit('close');
      } else {
        console.error('Title and body are required.');
      }
    },
    enterEditMode() {
      this.isEditMode = true;
    },
    exitEditMode() {
      this.isEditMode = false;
    },
    savePost() {
      this.$emit('update:post', this.localPost);
      this.exitEditMode();
    },
    deletePost() {
      this.$emit('delete-post', this.localPost.id);
    },
    toggleCommentForm() {
      this.isCommentFormVisible = !this.isCommentFormVisible;
    },
    addComment() {
      if (this.newComment.name.trim() && this.newComment.email.trim() && this.newComment.body.trim()) {
        if (!this.localPost.comments) {
          this.$set(this.localPost, 'comments', []);
        }
        this.localPost.comments.push({ ...this.newComment });
        this.newComment = { name: '', email: '', body: '' };
        this.isCommentFormVisible = false;
        this.$emit('update:post', this.localPost);
      } else {
        console.error('All fields are required.');
      }
    },
    deleteComment(index) {
      this.localPost.comments.splice(index, 1);
      this.$emit('update:post', this.localPost);
    },
  },
};
</script>

<style scoped>
.SideBar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
  max-width: 0; /* Start with the sidebar hidden */
}

.SideBar--open {
  opacity: 1;
  max-width: 50%; /* Expand to 50% of the screen width when open */
}

.tile.is-parent {
  padding: 0.75rem;
}

.tile {
  align-items: stretch;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: min-content;
}

@media screen and (min-width: 769px), print {
  .tile:not(.is-child) {
    display: flex;
  }
}

.is-clickable {
  cursor: pointer;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem; /* Adjust size for better visibility */
}

.icon.has-text-danger {
  color: #ff3860; /* Red color for the delete button */
}

.icon:hover {
  opacity: 0.8; /* Add hover effect for better interactivity */
}
</style>
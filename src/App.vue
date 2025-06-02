<template>
  <div class="app">
    <Header :user="currentUser" @logout="handleLogout" />
    <div class="container">
      <div class="tile is-ancestor"></div>
    </div>
    <div class="main-layout is-flex">
      <div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
        <!-- Sidebar for Add Post or Post Details -->
        <Sidebar v-if="sidebarOpen" class="Sidebar">
          <!-- Add Post Form -->
          <div v-if="selectedPost === null" class="add-post-form">
            <div
              class="is-flex is-justify-content-space-between is-align-items-center mb-4"
            >
              <p class="title mb-0">Create New Post</p>
            </div>
            <div class="field">
              <label class="label" for="post-title">Post Title</label>
              <div class="control">
                <input
                  class="input"
                  id="post-title"
                  v-model="newPostTitle"
                  placeholder="Enter post title"
                />
              </div>
            </div>
            <div class="field">
              <label class="label" for="post-body">Post Body</label>
              <div class="control">
                <textarea
                  class="textarea"
                  id="post-body"
                  v-model="newPostBody"
                  placeholder="Enter post body"
                ></textarea>
              </div>
            </div>
            <div class="field is-grouped is-justify-content-space-between mt-5">
              <div class="control">
                <button class="button is-link" @click="handleCreatePost">
                  Create
                </button>
              </div>
              <div class="control">
                <button class="button is-light" @click="toggleSidebar()">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Post Details & Comments -->
          <div v-else>
            <PostPreview
              :post="selectedPost"
              @editPost="toggleEditMode"
              @deletePost="handleDeletePost"
            />
            <h3 class="title is-5">Comments</h3>
            <div v-if="Array.isArray(comments) && comments.length">
              <Comment
                v-for="comment in comments"
                :key="comment.id"
                :name="comment.name"
                :email="comment.email"
                :body="comment.body"
                :commentId="comment.id"
                @delete="deleteComment"
              />
            </div>
            <div v-else class="notification is-info">No comments yet.</div>
            <CommentForm
              v-if="isAddingComment && selectedPost"
              :postId="selectedPost.id"
              @commentAdded="addComment"
              @closeForm="hideCommentForm"
            />
          </div>
        </Sidebar>

        <!-- Posts box -->
        <div
          class="posts-box box"
          :class="{ centered: !sidebarOpen, 'full-screen': !sidebarOpen }"
        >
          <div
            class="block is-flex is-justify-content-space-between is-align-items-center mb-4"
          >
            <p class="title mb-0">Posts</p>
            <button class="button is-link" @click="openAddPostSidebar">
              Add New Post
            </button>
          </div>

          <Loader v-if="isLoadingPosts" />
          <div v-else-if="hasError" class="notification is-danger">
            Failed to load posts. Please try again.
          </div>
          <div v-else>
            <PostsList
              v-if="posts && posts.length"
              :posts="posts"
              @openPost="handleOpenPost"
              @deletePost="handleDeletePost"
            />
            <div v-else class="notification is-info has-text-centered">
              No posts yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddPost from './components/AddPost.vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import PostsList from './components/PostsList.vue';
import PostPreview from './components/PostPreview.vue';
import Loader from './components/Loader.vue';
import Comment from './components/Comment.vue';
import CommentForm from './components/CommentForm.vue';
//import WriteCommentBtn from './components/WriteCommentBtn.vue'; // New component
import axios from 'axios';
const BASE_URL = 'https://mate-academy.github.io/fe-students-api';
export default {
  components: {
    AddPost,
    Header,
    Sidebar,
    PostsList,
    PostPreview,
    Loader,
    //WriteCommentBtn,
    Comment,
    CommentForm,
  },
  data() {
    return {
      currentUser: { name: 'John Doe' },
      sidebarOpen: false,
      selectedPost: null,
      posts: [],
      comments: [],
      isLoadingPosts: true,
      isLoadingComments: false,
      isAddingComment: false,
      hasError: false,
      commentsError: false,
      newPostTitle: '',
      newPostBody: '',
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`${BASE_URL}/posts`);
      console.log('Posts:', response.data.data);
      this.posts = Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      this.hasError = true;
      this.posts = [];
    } finally {
      this.isLoadingPosts = false;
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('userId');
      this.currentUser = null;
      this.$router.push('/login');
    },

    deleteComment(commentId) {
      const originalComments = [...this.comments]; // Store current state in case of error

      // Instantly remove the comment from the UI for better UX
      this.comments = this.comments.filter(
        (comment) => comment.id !== commentId
      );

      // Send delete request to the API
      axios
        .delete(`${BASE_URL}/comments/${commentId}`)
        .then(() => this.fetchComments()) // Refresh comments after deletion
        .catch(() => {
          // Restore original comments if deletion fails
          this.comments = originalComments;
          alert('Failed to delete comment. Please try again.');
        });
    },
    addComment(newComment) {
      this.isAddingComment = false;
      this.fetchComments(); // Refresh comments after adding
    },

    toggleSidebar(action = null) {
      if (action === 'newPost') {
        this.sidebarOpen = true;
        this.selectedPost = null;
        this.isEditingPost = false;
        this.isAddingComment = false;
      } else if (action === 'close') {
        this.sidebarOpen = false;
      } else {
        this.sidebarOpen = !this.sidebarOpen;
      }
      console.log('Sidebar State:', this.sidebarOpen);
    },
    openAddPostSidebar() {
      this.sidebarOpen = true;
      this.selectedPost = null;
      this.newPostTitle = '';
      this.newPostBody = '';
      console.log('Sidebar Opened:', this.sidebarOpen);
    },
    async handleCreatePost() {
      if (!this.newPostTitle.trim() || !this.newPostBody.trim()) {
        alert('Please fill in both title and body.');
        return;
      }
      // Simulate userId, replace with actual user if needed
      const userId = localStorage.getItem('userId') || 1;
      try {
        const response = await axios.post(`${BASE_URL}/posts`, {
          title: this.newPostTitle,
          body: this.newPostBody,
          userId,
        });

        if (response.data && response.data.data) {
          this.posts.unshift(response.data.data);
          console.log('Post Created:', response.data.data);
        }
        this.toggleSidebar();
      } catch (error) {
        alert('Failed to create post.');
      }
    },
    async handleOpenPost(post) {
      this.sidebarOpen = true;
      this.selectedPost = post;
      this.isLoadingComments = true;
      this.commentsError = false;
      this.isAddingComment = false;

      try {
        const response = await axios.get(
          `${BASE_URL}/posts/${post.id}/comments`
        );
        this.comments = Array.isArray(response.data.data)
          ? response.data.data
          : [];
      } catch (error) {
        this.commentsError = true;
        this.comments = [];
      } finally {
        this.isLoadingComments = false;
      }
    },
    async handleDeletePost(postId) {
      await axios.delete(`${BASE_URL}/posts/${postId}`);
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.sidebarOpen = false;
      this.selectedPost = null;
      this.isAddingComment = false;
    },
    async fetchComments() {
      this.isLoadingComments = true;
      try {
        const response = await axios.get(
          `${BASE_URL}/posts/${this.selectedPost.id}/comments`
        );
        this.comments = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        this.isAddingComment = false; // Hide form after successful submission
      } catch (error) {
        this.commentsError = true;
        this.comments = [];
      } finally {
        this.isLoadingComments = false;
      }
    },

    showCommentForm() {
      if (!this.selectedPost) {
        return;
      }
      this.isAddingComment = true;
    },
    hideCommentForm() {
      this.isAddingComment = false;
    },
    handleSavePost(updatedPost) {
      const index = this.posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        this.posts[index] = updatedPost; // Update post list
      }
      this.isEditingPost = false; // Show post preview again
    },
  },
};
</script>

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const BASE_URL = 'https://mate.academy/students-api';

// Import components
import AddCommentForm from './components/AddCommentForm.js';
import CommentItem from './components/CommentItem.js';

createApp({
  components: {
    'add-comment-form': AddCommentForm,
    'comment-item': CommentItem
  },
  
  data() {
    return {
      // Posts data
      posts: [],
      selectedPost: null,
      isLoading: false,
      error: null,
      
      // Sidebar state
      isSidebarOpen: false,
      showCreateForm: false,
      
      // Create post form
      newPost: {
        title: '',
        body: ''
      },
      createErrors: {},
      isCreating: false,
      
      // Edit post form
      isEditing: false,
      editForm: {
        title: '',
        body: ''
      },
      editErrors: {},
      isSaving: false,
      
      // Comments
      comments: [],
      isLoadingComments: false,
      commentsError: null,
      showCommentForm: false,
      
      // Comment form
      commentForm: {
        name: '',
        email: '',
        body: ''
      },
      
      // Current user (hardcoded for demo)
      currentUser: {
        id: 1,
        name: 'Demo User'
      }
    };
  },
  
  async mounted() {
    await this.loadPosts();
  },
  
  methods: {
    // Load posts for current user
    async loadPosts() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${BASE_URL}/posts?userId=${this.currentUser.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        this.posts = await response.json();
      } catch (error) {
        console.error('Error loading posts:', error);
        this.error = 'Failed to load posts. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    
    // Open sidebar for creating new post
    openCreatePost() {
      this.isSidebarOpen = true;
      this.showCreateForm = true;
      this.selectedPost = null;
      this.isEditing = false;
      this.showCommentForm = false;
      this.resetCreateForm();
    },
    
    // Open sidebar for viewing/editing post
    async openPost(post) {
      this.isSidebarOpen = true;
      this.showCreateForm = false;
      this.selectedPost = post;
      this.isEditing = false;
      this.showCommentForm = false;
      
      // Load comments for the post
      await this.loadComments(post.id);
    },
    
    // Close sidebar
    closeSidebar() {
      this.isSidebarOpen = false;
      this.showCreateForm = false;
      this.selectedPost = null;
      this.isEditing = false;
      this.showCommentForm = false;
      this.comments = [];
      this.commentsError = null;
    },
    
    // Create new post
    async createPost() {
      if (!this.validateCreateForm()) {
        return;
      }
      
      this.isCreating = true;
      
      try {
        const response = await fetch(`${BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            title: this.newPost.title,
            body: this.newPost.body,
            userId: this.currentUser.id
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newPost = await response.json();
        
        // Add new post to the list
        this.posts.unshift(newPost);
        
        // Show the new post in sidebar
        this.selectedPost = newPost;
        this.showCreateForm = false;
        this.isEditing = false;
        
        // Reset form
        this.resetCreateForm();
        
      } catch (error) {
        console.error('Error creating post:', error);
        this.createErrors.general = 'Failed to create post. Please try again.';
      } finally {
        this.isCreating = false;
      }
    },
    
    // Validate create form
    validateCreateForm() {
      this.createErrors = {};
      
      if (!this.newPost.title.trim()) {
        this.createErrors.title = 'Title is required';
      }
      
      if (!this.newPost.body.trim()) {
        this.createErrors.body = 'Body is required';
      }
      
      return Object.keys(this.createErrors).length === 0;
    },
    
    // Reset create form
    resetCreateForm() {
      this.newPost = { title: '', body: '' };
      this.createErrors = {};
    },
    
    // Start editing post
    editPost() {
      this.isEditing = true;
      this.editForm = {
        title: this.selectedPost.title,
        body: this.selectedPost.body
      };
      this.editErrors = {};
    },
    
    // Cancel editing
    cancelEdit() {
      this.isEditing = false;
      this.editForm = { title: '', body: '' };
      this.editErrors = {};
    },
    
    // Save edited post
    async saveEdit() {
      if (!this.validateEditForm()) {
        return;
      }
      
      this.isSaving = true;
      
      try {
        const response = await fetch(`${BASE_URL}/posts/${this.selectedPost.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            title: this.editForm.title,
            body: this.editForm.body
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedPost = await response.json();
        
        // Update post in the list
        const index = this.posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
        
        // Update selected post
        this.selectedPost = updatedPost;
        
        // Exit edit mode
        this.isEditing = false;
        
      } catch (error) {
        console.error('Error updating post:', error);
        this.editErrors.general = 'Failed to update post. Please try again.';
      } finally {
        this.isSaving = false;
      }
    },
    
    // Validate edit form
    validateEditForm() {
      this.editErrors = {};
      
      if (!this.editForm.title.trim()) {
        this.editErrors.title = 'Title is required';
      }
      
      if (!this.editForm.body.trim()) {
        this.editErrors.body = 'Body is required';
      }
      
      return Object.keys(this.editErrors).length === 0;
    },
    
    // Delete post
    async deletePost() {
      if (!confirm('Are you sure you want to delete this post?')) {
        return;
      }
      
      try {
        const response = await fetch(`${BASE_URL}/posts/${this.selectedPost.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Remove post from the list
        const index = this.posts.findIndex(p => p.id === this.selectedPost.id);
        if (index !== -1) {
          this.posts.splice(index, 1);
        }
        
        // Close sidebar
        this.closeSidebar();
        
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    },
    
    // Load comments for a post
    async loadComments(postId) {
      this.isLoadingComments = true;
      this.commentsError = null;
      
      try {
        const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        this.comments = await response.json();
      } catch (error) {
        console.error('Error loading comments:', error);
        this.commentsError = 'Failed to load comments. Please try again.';
      } finally {
        this.isLoadingComments = false;
      }
    },
    

    
    // Handle comment added from component
    onCommentAdded(newComment) {
      // Add new comment to the list
      this.comments.push(newComment);
      
      // Update form with successful name and email
      this.commentForm.name = newComment.name;
      this.commentForm.email = newComment.email;
    },

    // Handle comment error from component
    onCommentError(error) {
      console.error('Comment error:', error);
      // Error is already handled in component
    },

    // Handle comment deleted from component
    onCommentDeleted(commentId) {
      // Remove comment from the list
      const index = this.comments.findIndex(c => c.id === commentId);
      if (index !== -1) {
        this.comments.splice(index, 1);
      }
    },

    // Handle comment delete error from component
    onCommentDeleteError({ commentId, error }) {
      console.error('Comment delete error:', error);
      // Error is already handled in component with retry button
    }
  }
}).mount('#app');

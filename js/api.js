// API Service for Posts and Comments
const API_BASE = 'https://mate-api.herokuapp.com';
const USER_ID = 1; // ID del usuario que ha iniciado sesión

const api = {
  // Posts
  async getPosts() {
    const response = await fetch(`${API_BASE}/posts?userId=${USER_ID}`);
    if (!response.ok) {
      throw new Error('Failed to load posts');
    }
    return response.json();
  },

  async createPost(postData) {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...postData,
        userId: USER_ID,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return response.json();
  },

  async updatePost(postId, postData) {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    return response.json();
  },

  async deletePost(postId) {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  },

  // Comments
  async getComments(postId) {
    const response = await fetch(`${API_BASE}/comments?postId=${postId}`);
    if (!response.ok) {
      throw new Error('Failed to load comments');
    }
    return response.json();
  },

  async createComment(commentData) {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
    return response.json();
  },

  async deleteComment(commentId) {
    const response = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  },

  // Users
  async getUser(userId) {
    const response = await fetch(`${API_BASE}/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to load user');
    }
    return response.json();
  },
};

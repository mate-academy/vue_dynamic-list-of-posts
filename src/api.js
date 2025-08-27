// Posts and Users Mate API service
const API_BASE = 'https://posts-users-mate.example.com/api';

export async function fetchPosts(userId) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/posts`);
    if (!res.ok) throw new Error('Failed to load posts');
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function createPost(postData) {
  try {
    const res = await fetch(`${API_BASE}/users/${postData.userId}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: postData.title, body: postData.body }),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function updatePost(postId, postData) {
  try {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function deletePost(postId) {
  try {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return true;
  } catch (err) {
    throw err;
  }
}

export async function fetchComments(postId) {
  try {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
    if (!res.ok) throw new Error('Failed to load comments');
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function addComment(postId, commentData) {
  try {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function deleteComment(commentId) {
  try {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return true;
  } catch (err) {
    throw err;
  }
}

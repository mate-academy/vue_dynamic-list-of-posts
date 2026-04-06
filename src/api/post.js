import axios from 'axios';

// We keep the instance, but we remove the hardcoded USER_ID constant
export const client = axios.create({
    baseURL: 'https://mate.academy/students-api',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
});

/**
 * Posts API calls
 */

// Fetch all posts for a specific user (userId passed as argument)
export const getPosts = (userId) =>
    client.get(`/posts?userId=${userId}`).then(res => res.data);

// Create a new post for a specific user
export const createPost = ({ userId, title, body }) =>
    client.post('/posts', { userId, title, body }).then(res => res.data);

// Update an existing post using PATCH
export const updatePost = ({ id, title, body }) =>
    client.patch(`/posts/${id}`, { title, body }).then(res => res.data);

// Remove a post by its ID
export const deletePost = (postId) =>
    client.delete(`/posts/${postId}`).then(res => res.data);

/**
 * Comments API calls
 */

// Fetch all comments for a specific post
export const getComments = (postId) =>
    client.get(`/comments?postId=${postId}`).then(res => res.data);

// Add a new comment to a post
export const createComment = (data) =>
    client.post('/comments', data).then(res => res.data);

// Remove a comment by its ID
export const deleteComment = (commentId) =>
    client.delete(`/comments/${commentId}`).then(res => res.data);
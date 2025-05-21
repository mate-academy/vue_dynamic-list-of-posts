import { client } from './httpClient';

// Users API

export const getUsers = () => {
  return client.get('/users');
};

export const addUser = (email, name) => {
  return client.post('/users', {
    name: name,
    username: null,
    email: email,
    phone: null,
  });
};

// Posts API

export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const addPost = (userId, title, body) => {
  return client.post('posts/', {
    userId,
    title,
    body,
  });
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

export const updatePost = ({ id, title, body }) => {
  return client.patch(`/posts/${id}`, {
    title,
    body,
  });
};

// Comments API

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const addComment = (postId, name, email, body) => {
  return client.post('comments/', {
    postId,
    name,
    email,
    body,
  });
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};

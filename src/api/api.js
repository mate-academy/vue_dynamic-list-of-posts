import { client } from '../utils/fetchClient';

export const getUsersByEmail = (email) => {
  return client.get(`/users?email=${email}`);
};

export const createUser = ({ name, email }) => {
  const username = email.split('@')[0];
  return client.post('/users', { name, username, email });
};

export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const createPost = ({ userId, title, body }) => {
  return client.post('/posts', { userId, title, body });
};

export const updatePost = (postId, { title, body, userId }) => {
  return client.patch(`/posts/${postId}`, { title, body, userId });
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const createComment = ({ postId, name, email, body }) => {
  return client.post('/comments', { postId, name, email, body });
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};

import { client } from './httpClient';

export const getPosts = () => {
  return client.get('/posts');
};

export const getUser = (email) => {
  return client.get(`/users?email=${email}`);
};

export const createUser = ({ name, email }) => {
  return client.post('/users', { name, email });
};

export const createPost = ({ title, body, userId }) => {
  return client.post('/posts', { title, body, userId });
};

export const updatePost = ({ id, title, body }) => {
  return client.patch(`/posts/${id}`, { title, body });
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

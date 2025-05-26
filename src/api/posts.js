import { client } from '../utils/fetchClient';

export const getUserPosts = userId => {
  return client.get(`/posts?userId=${userId}`);
};

export const addNewPost = data => {
  return client.post('/posts', data);
};

export const updatePost = (id, data) => {
  return client.patch(`/posts/${id}`, data);
};

export const deletePost = id => {
  return client.delete(`/posts/${id}`);
};

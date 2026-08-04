import { client } from '@/utils/http';

export const getPosts = userId => {
  return client.get(`/posts?userId=${userId}`)
    .then(response => response.data);
};

export const createPost = ({ userId, title, body }) => {
  return client.post('/posts', {
    userId,
    title,
    body,
  }).then(response => response.data);
};

export const updatePost = ({ id, title, body }) => {
  return client.patch(`/posts/${id}`, {
    title,
    body,
  }).then(response => response.data);
};

export const deletePost = postId => {
  return client.delete(`/posts/${postId}`)
    .then(response => response.data);
};
import { client } from '../utils/http';

export const getPosts = async (userId) => {
  const { data } = await client.get(`/posts?userId=${userId}`);

  return data;
};

export const getPostById = async (id) => {
  const { data } = await client.get(`/posts/${id}`);

  return data;
};

export const createPost = async ({ userId, title, body }) => {
  const { data } = await client.post('/posts', {
    userId,
    title,
    body,
  });

  return data;
};

export const updatePost = async ({ id, title, body }) => {
  const { data } = await client.patch(`/posts/${id}`, {
    title,
    body,
  });

  return data;
};

export const deletePost = async (id) => {
  const { data } = await client.delete(`/posts/${id}`);

  return data;
};


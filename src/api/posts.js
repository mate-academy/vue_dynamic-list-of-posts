import { client } from '@/utils/http';
import { getUserId } from '@/utils/userLocalStorageManagement';

export const getPosts = async () => {
  const response = await client.get(`/posts?userId=${getUserId()}`);

  return response.data;
};

export const getPostById = async id => {
  const response = await client.get(`/posts/${id}`);

  return response.data;
};

export const createPost = async (title, body) => {
  const response = await client.post('/posts', { userId: getUserId(), title, body });

  return response.data;
};

export const deletePost = async id => {
  await client.delete(`/posts/${id}`);
};

export const editPost = async (id, title, body) => {
  const response = await client.patch(`/posts/${id}`, { userId: getUserId(), title, body });

  return response.data;
};

import { client } from '@/utils/http';


export const getPosts = async (userId) => {
  const response = await client.get(`/posts?userId=${userId}`);
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await client.get(`/posts/${postId}`);

  return response.data;
};

export const createPost = async (body) => {
  const response = await client.post(`/posts`, body);

  return response.data;
}

export const updatePost = async (postId, body) => {
  const response = await client.patch(`/posts/${postId}`, body);

  return response.data;
};

export const deletePost = async id => {
  const response = await client.delete(`/posts/${id}`);

  return response.data;
};

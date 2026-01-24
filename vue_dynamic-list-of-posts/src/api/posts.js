import { client } from "@/utils/http";

export const getPosts = async (userId) => {
  const response = await client.get(`/posts?userId=${userId}`);

  return response.data;
}

export const createPost = async ({ userId, title, body }) => {
  const response = await client.post('/posts', {
    userId,
    title,
    body,
  });

  return response.data;
}

export const deletePost = async (id) => {
  const response = await client.delete(`/posts/${id}`);

  return response.data;
}

export const updatePost = async ({ id, userId, title, body }) => {
  const response = await client.patch(`/posts/${id}`, { userId, title, body });

  return response.data;
}

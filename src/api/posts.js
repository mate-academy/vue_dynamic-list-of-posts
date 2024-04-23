import { client } from "@/httpClient";

export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const createPost = (userId, title, body) => {
  return client.post('/posts', {
    userId,
    title,
    body,
  });
};

export const updatePost = (postId, title, body) => {
  return client.patch(`/posts/${postId}`, {
    title,
    body,
  });
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};
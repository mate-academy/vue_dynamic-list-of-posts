import { client } from "../utils/httpClient";

export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const addPost = (data) => {
  return client.post(`/posts`, data);
};

export const updatePost = ({ postId, title, body }) => {
  return client.patch(`/posts/${postId}`, {
    title,
    body,
  });
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

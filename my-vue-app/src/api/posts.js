import { client } from "../utils/httpClient";

export const getUserPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const addPost = (post) => {
  return client.post("/posts", post);
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

export const updatePost = (postId, updatedPost) => {
  return client.patch(`/posts/${postId}`, updatedPost);
};
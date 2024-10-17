import { client } from "./httpClient";

export const getUserPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const getPosts = () => {
  return client.get("/posts");
};

export const createPost = ({ body, title, userId }) => {
  return client.post("/posts", { body, title, userId });
};

export const updatePost = ({ body, title, postId }) => {
  return client.patch(`/posts/${postId}`, { body, title });
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

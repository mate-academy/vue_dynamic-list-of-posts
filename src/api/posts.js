import { client } from "./api";

export const getPosts = () => {
  return client.get(`/posts?userId=1416`);
};

export const addPost = (data) => {
  return client.post("/posts", data);
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

export const updatePost = ({ postId, title, body }) => {
  return client.patch(`/posts/${postId}`, {
    title,
    body,
  });
};
import { client } from "../utils/http.client.js";


export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const addPost = (data) => {
  return client.post("/posts", data);
};

export const removePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

export const updatePost = ({ postId, title, body }) => {
  return client.patch(`/posts/${postId}`, {
    title,
    body,
  });
};

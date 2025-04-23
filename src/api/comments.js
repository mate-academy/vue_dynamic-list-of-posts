import { client } from "../utils/http.client.js";

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const addComment = (data) => {
  return client.post("/comments", data);
};

export const removeComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};

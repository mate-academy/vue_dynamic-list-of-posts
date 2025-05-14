import { client } from "./httpClients";

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const addComment = (data) => {
  return client.post("/comments", data);
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};
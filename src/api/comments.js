import { client } from "./httpClient";

export const getPostComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const createComment = (data) => {
  return client.post('/comments', data);
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};
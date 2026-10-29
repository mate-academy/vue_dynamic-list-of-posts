import { client } from "../utils/client";

export const createComment = (data) => {
  return client.post('/comments', data);
};

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};
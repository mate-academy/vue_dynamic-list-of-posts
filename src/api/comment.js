import { client } from "../utils/httpClient";

export const getPostComments = (postId) => {
  return client.get(`/comments/${postId}`);
};

export const createComment = (newComment) => {
  return client.post('/comments', newComment);
};

export const removeComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};
import { client } from "../utils/httpClient";

export const getPostComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const addCommentPost = (comment) => {

  return client.post(`/comments`, comment);
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};
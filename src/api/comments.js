import { client } from "@/httpClient";

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const createComment = (postId, name, email, body) => {
  return client.post('/comments', {
    postId,
    name,
    email,
    body,
  });
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};
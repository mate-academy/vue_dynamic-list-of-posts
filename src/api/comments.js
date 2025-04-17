import { client } from "../utils/httpClient";

export const getCommentsByPostId = (postId) => client.get(`/comments`, {
  params: { postId },
});

export const addComment = (comment) => client.post(`/comments`, comment);

export const deleteComment = (commentId) => client.delete(`/comments/${commentId}`);

import { client } from '@/utils/httpClient';

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const postComment = (postId, name, email, body) => {
  return client.post('/comments', { postId, name, email, body });
};

export const removeComment = (commentId) => {
  return client.delete(`/comments/${commentId}`);
};

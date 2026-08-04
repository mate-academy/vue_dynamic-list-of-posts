import { client } from '@/utils/http';

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`)
    .then(response => response.data);
};

export const createComment = ({ postId, name, email, body }) => {
  return client.post('/comments', {
    postId,
    name,
    email,
    body,
  }).then(response => response.data);
};

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`)
    .then(response => response.data);
};
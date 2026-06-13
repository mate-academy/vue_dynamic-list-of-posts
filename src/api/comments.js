import { client } from './client';

export function getPostComments(postId) {
  return client.get(`/comments?postId=${postId}`);
}

export function createComment(data) {
  return client.post('/comments', data);
}

export function deleteComment(id) {
  return client.delete(`/comments/${id}`);
}

import { client } from './client';

// Busca todos os comentários pertencentes a um post
export function getPostComments(postId) {
  return client.get(`/comments?postId=${postId}`);
}

// Cria um novo comentário
export function createComment(data) {
  return client.post('/comments', data);
}

// Deleta um comentário pelo ID
export function deleteComment(id) {
  return client.delete(`/comments/${id}`);
}

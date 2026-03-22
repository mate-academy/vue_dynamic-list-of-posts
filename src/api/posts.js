import { client } from './client';

// Busca apenas os posts de um usuário específico
export function getUserPosts(userId) {
  return client.get(`/posts?userId=${userId}`);
}

// Cria um novo post
export function createPost(data) {
  return client.post('/posts', data);
}

// Atualiza um post existente (edit mode)
export function updatePost(id, data) {
  return client.patch(`/posts/${id}`, data);
}

// Deleta um post pelo ID
export function deletePost(id) {
  return client.delete(`/posts/${id}`);
}

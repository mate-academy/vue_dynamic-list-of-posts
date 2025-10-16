import axios from 'axios';

/**
 * ✅ Base URL exigida pela Mate Academy
 * Caso o .env contenha VITE_API_BASE_URL, ele será usado.
 * Caso contrário, usa a Mate API padrão.
 */
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://mate-academy.github.io/fe-students-api';

/**
 * Configuração do cliente Axios
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

/**
 * ===============================
 * USERS
 * ===============================
 */

/**
 * Busca todos os usuários
 */
export async function fetchUsers() {
  const { data } = await api.get('/users');
  return data;
}

/**
 * ===============================
 * POSTS
 * ===============================
 */

/**
 * Busca todos os posts de um usuário específico
 */
export async function fetchUserPosts(userId) {
  const { data } = await api.get('/posts', { params: { userId } });
  return data;
}

/**
 * Busca detalhes de um post
 */
export async function fetchPost(postId) {
  const { data } = await api.get(`/posts/${postId}`);
  return data;
}

/**
 * Cria um novo post
 */
export async function createPost({ userId, title, body }) {
  const { data } = await api.post('/posts', { userId, title, body });
  return data;
}

/**
 * Atualiza um post existente
 */
export async function updatePost(postId, payload) {
  const { data } = await api.patch(`/posts/${postId}`, payload);
  return data;
}

/**
 * Deleta um post
 */
export async function deletePost(postId) {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
}

/**
 * ===============================
 * COMMENTS
 * ===============================
 */

/**
 * Busca todos os comentários de um post
 */
export async function fetchComments(postId) {
  const { data } = await api.get('/comments', { params: { postId } });
  return data;
}

/**
 * Cria um novo comentário
 */
export async function createComment({ postId, name, email, body }) {
  const { data } = await api.post('/comments', { postId, name, email, body });
  return data;
}

/**
 * Deleta um comentário
 */
export async function deleteComment(commentId) {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
}

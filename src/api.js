const BASE_URL = import.meta.env.VITE_API_URL || 'https://mate.academy/students-api';

export async function request(path, { method = 'GET', data, signal } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    signal: signal || AbortSignal.timeout(15000),
    headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  findUsers: email => request(`/users?email=${encodeURIComponent(email)}`),
  createUser: data => request('/users', { method: 'POST', data }),
  getPosts: userId => request(`/posts?userId=${userId}`),
  createPost: data => request('/posts', { method: 'POST', data }),
  updatePost: (id, data) => request(`/posts/${id}`, { method: 'PATCH', data }),
  deletePost: id => request(`/posts/${id}`, { method: 'DELETE' }),
  getComments: postId => request(`/comments?postId=${postId}`),
  createComment: data => request('/comments', { method: 'POST', data }),
  deleteComment: id => request(`/comments/${id}`, { method: 'DELETE' }),
};

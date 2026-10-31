const BASE_URL = 'https://mate.academy/students-api';

async function request(path, { method = 'GET', data } = {}) {
  const options = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
  }

  const response = await fetch(BASE_URL + path, options);
  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok || payload?.error) {
    throw new Error(payload?.error || response.statusText || 'Request failed');
  }

  return payload;
}

export async function getUserByEmail(email) {
  const users = await request(`/users?email=${encodeURIComponent(email)}`);

  return users[0] || null;
}

export const createUser = (data) => request('/users', { method: 'POST', data });

export const getPosts = (userId) => request(`/posts?userId=${userId}`);
export const createPost = (data) => request('/posts', { method: 'POST', data });
export const updatePost = (id, data) =>
  request(`/posts/${id}`, { method: 'PATCH', data });
export const deletePost = (id) => request(`/posts/${id}`, { method: 'DELETE' });

export const getComments = (postId) => request(`/comments?postId=${postId}`);
export const createComment = (data) =>
  request('/comments', { method: 'POST', data });
export const deleteComment = (id) =>
  request(`/comments/${id}`, { method: 'DELETE' });

import { request } from './client.js';

export function getPostsByUserId(userId) {
  const params = new URLSearchParams({ userId: String(userId) });

  return request(`/posts?${params.toString()}`);
}

export function createPost(post) {
  return request('/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(post),
  });
}

export function updatePost(postId, changes) {
  return request(`/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(changes),
  });
}

export function deletePost(postId) {
  return request(`/posts/${postId}`, {
    method: 'DELETE',
  });
}

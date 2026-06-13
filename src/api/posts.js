import { client } from './client';

export function getUserPosts(userId) {
  return client.get(`/posts?userId=${userId}`);
}

export function createPost(data) {
  return client.post('/posts', data);
}

export function updatePost(id, data) {
  return client.patch(`/posts/${id}`, data);
}

export function deletePost(id) {
  return client.delete(`/posts/${id}`);
}

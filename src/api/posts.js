import client from './httpClient.js';

export async function getPosts(userId) {
  const response = await client.get('/posts', { params: { userId } });

  return response.data;
}

export async function createPost({ title, body, userId }) {
  const response = await client.post('/posts', { title, body, userId });

  return response.data;
}

export async function updatePost({ id, title, body }) {
  const response = await client.patch(`/posts/${id}`, { title, body });

  return response.data;
}

export async function deletePost(postId) {
  const response = await client.delete(`/posts/${postId}`);

  return response.data;
}

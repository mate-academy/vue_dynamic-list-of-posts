import client from './httpClient.js';

export async function getComments(postId) {
  const response = await client.get('/comments', { params: { postId } });

  return response.data;
}

export async function createComment({ postId, name, email, body }) {
  const response = await client.post('/comments', {
    postId,
    name,
    email,
    body,
  });

  return response.data;
}

export async function deleteComment(commentId) {
  const response = await client.delete(`/comments/${commentId}`);

  return response.data;
}

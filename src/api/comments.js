import { client } from '../utils/http';

export async function getComment(postId) {
  const { data } = await client.get(`/comments?postId=${postId}`);

  return data;
};

export async function createComment(postId, {name, email, body}) {
  const { data } = await client.post('/comments', {
    postId,
    name,
    email,
    body,
  });

  return data;
};
export async function updateComment({ id, name, email, body }) {
  const { data } = await client.patch(`/comments/${id}`, {
    id,
    name,
    email,
    body
  });

  return data;
};

export async function deleteComment(id) {
  const { data } = await client.delete(`/comments/${id}`);

  return data;
};

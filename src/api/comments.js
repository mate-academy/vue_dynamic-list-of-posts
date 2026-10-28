import { client } from '../utils/http';

export const getComments = async (postId) => {
  const { data } = await client.get(`/comments?postId=${postId}`);

  return data;
};

export const createComment = async ({
  postId,
  name,
  email,
  body,
}) => {
  const { data } = await client.post('/comments', {
    postId,
    name,
    email,
    body,
  });

  return data;
};

export const deleteComment = async (id) => {
  await client.delete(`/comments/${id}`);
};

import { client } from '@/utils/http';

export const getPostComments = async postId => {
  const comments = await client.get(`/comments?postId=${postId}`);

  return comments.data;
};

export const postComment = async (postId, name, email, body) => {
  const newComment = await client.post('/comments', { postId, name, email, body });

  return newComment.data;
};

export const deleteComment = async commentId => {
  await client.delete(`/comments/${commentId}`);
};

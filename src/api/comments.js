import { client } from './../utils/fetchClient';

export const getComments = async postId => {
  const response = await client.get(`/comments?postId=${postId}`);

  return response.data;
};

export const addComment = async commentData => {
  const response = await client.post('/comments', commentData);

  return response.data;
};

export const deleteComment = async commentId => {
  const response = await client.delete(`/comments/${commentId}`);

  return response.data;
};

import { client } from '../utils/fetchClient';

export const getCommentsOfPosts = (postId) => {
  return client.get(`/comments?postId=${postId}`);
};

export const addNewComment = (data) => {
  return client.post('/comments', data);
}

export const deleteComment = (id) => {
  return client.delete(`/comments/${id}`);
}

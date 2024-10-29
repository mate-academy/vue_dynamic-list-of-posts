import { client } from "./axiosClient"

export const getCommentsOfPost = async (postId) => {
  return client.get(`/comments?postId=${postId}`);
}

export const createNewComment = async (data) => {
  return client.post('/comments', data);
}

export const removeComment = async (commentId) => {
  return client.delete(`/comments/${commentId}`);
}
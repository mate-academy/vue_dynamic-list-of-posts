import { client } from "./axiousClient"

export const getCommentsOfPost = async (postId) => {
  return client.get(`/comments?postId=${postId}`);
}

export const createNewComment = async (data) => {
  console.log(data);
  return client.post('/comments', data);
}

export const removeComment = async (commentId) => {
  return client.delete(`/comments/${commentId}`);
}
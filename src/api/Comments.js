import { client } from "../client/client.js";

export const getComment = (postId) => {
  return client.get(`/comments?postId=${postId}`)
}

export const createComment = async ({
  postId,
  name,
  email,
  body,
}) => {
  try {
    const response = await client.post('/comments', {
      postId,
      name,
      email,
      body
    });
    return response;
  } catch (error) {
    throw new Error('Error creating comment: ' + error.message);
  }
}

export const removeComment = async (commentId) => {
  return client.delete(`/comments/${commentId}`)
}
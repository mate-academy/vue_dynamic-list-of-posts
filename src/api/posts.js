import { client } from "../utils/httpClient";

const postAddress = '/posts';
const commentAddress = '/comments';

export const getPosts = () => {
  return client.get(`${postAddress}?userId=11250`)
};

export const getPostsComments = (postId) => {
  return client.get(`${commentAddress}?postId=${postId}`)
};

export const getPost = (postId) => {
  return client.get(`${postAddress}/${postId}`)
};

export const getUser = (userId) => {
  return client.get(`/users/${userId}`)
};

export const createPost = (title, body, userId) => {
  return client.post(postAddress, {
    title,
    body,
    userId,
  })
};

export const createComment = (postId, name, email, body) => {
  return client.post(commentAddress, {
    postId,
    name,
    email,
    body,
  });
};

export const updatePost = (postId, title, body) => {
  return client.patch(`${postAddress}/${postId}`, {
    title,
    body,
  });
};

export const deletePost = (postId) => {
  return client.delete(`${postAddress}/${postId}`)
};

export const deleteComment = (id) => {
  return client.delete(`${commentAddress}/${id}`);
};
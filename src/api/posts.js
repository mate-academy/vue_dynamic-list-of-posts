import { client } from "../utils/client";

export const USER_ID = 4138;

export const getPosts = () => {
  return client.get(`/posts?userId=${USER_ID}`);
};

export const createPost = (postData) => {
  return client.post('/posts', {
    ...postData,
    userId: USER_ID,
  });
};

export const updatePost = (postId, updatedData) => {
  return client.patch(`/posts/${postId}`, updatedData);
};

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};
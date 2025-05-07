import axios from "axios";

const postsClient = axios.create({
  baseURL: "https://mate.academy/students-api/posts",
});

export const getPosts = (userId) => {
  return postsClient.get(`?userId=${userId}`);
};

export const getPostById = (postId) => {
  return postsClient.get(`${postId}`);
};

export const createPost = (title, body, userId) => {
  return postsClient.post(``, {
    userId,
    title,
    body,
  });
};

export const patchPost = (postId, title, body) => {
  return postsClient.patch(`${postId}`, {
    title,
    body,
  });
};

export const destroyPost = (postId) => {
  return postsClient.delete(`${postId}`);
};

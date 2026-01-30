import client from "../utils/httpClient.js";

export const getPosts = (userId) => {
  return client
    .get(`/posts?userId=${userId}`)
    .then((response) => response.data);
};

export const removePost = (postId) => {
  return client.delete(`posts/${postId}`).then((response) => response.data);
};

export const createPost = ({ title, body, userId }) => {
  return client
    .post("/posts", { title, body, userId: userId })
    .then((response) => response.data);
};

export const editPost = ({ id, title, body }) => {
  return client
    .patch(`/posts/${id}`, { title, body })
    .then((response) => response.data);
};

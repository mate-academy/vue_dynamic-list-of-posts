import axios from "axios";

const client = axios.create({
  baseURL: "https://mate.academy/students-api/comments",
});

export const getComments = (postId) => {
  return client.get(`?postId=${postId}`);
};

export const createComment = (postId, name, email, body) => {
  return client.post(``, {
    postId,
    name,
    email,
    body,
  });
};

export const destroyComment = (commentId) => {
  return client.delete(`${commentId}`);
};

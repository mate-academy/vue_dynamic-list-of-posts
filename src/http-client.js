import axios from "axios";

const TEMP_USER_ID = 1142;

const postsClient = axios.create({
  baseURL: "https://mate.academy/students-api/posts",
});

export const getPosts = (userId) => {
  return postsClient.get(`?userId=${userId}`);
};

export const createPost = (title, body, userId) => {
  return postsClient.post(``, {
    userId,
    title,
    body,
  });
};

const usersClient = axios.create({
  baseURL: "https://mate.academy/students-api/users",
});

export const findUser = async (email) => {
  const usersList = await usersClient.get(`?email=${email}`);
  return usersList.data.length === 0 ? null : usersList.data[0];
};

export const createUser = (name, email) => {
  return usersClient.post(``, {
    name,
    email,
  });
};

const commentsClient = axios.create({
  baseURL: "https://mate.academy/students-api/comments",
});

export const getComments = (postId) => {
  return commentsClient.get(`?postId=${postId}`);
};

import axios from "axios";

const TEMP_USER_ID = 2;

const postsClient = axios.create({
  baseURL: "https://mate.academy/students-api/posts",
});

export const getPosts = () => {
  return postsClient.get(`?userId=${TEMP_USER_ID}`);
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

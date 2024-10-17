import { client } from "./httpClient";

export const getUsers = () => {
  return client.get("/users");
};

export const getUserByEmail = (email) => {
  return client.get(`/users?email=${email}`);
};

export const registrationUser = (email, name) => {
  return client.post(`/users?email=${email}`, { email, name });
};

import { client } from "./api";

export const getUser = (email) => {
  return client.get(`/users?email=${email}`);
};

export const addUser = ({ name, username, email, phone }) => {
  return client.post("/users", { name, username, email, phone });
};
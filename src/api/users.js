import { client } from "./api";

export const getUser = (email) => {
  return client.get(`/users?email=${email}`);
};

export const addUser = ({ nam, username, email, phone }) => {
  return client.post("/users", { name, username, email, phone });
};

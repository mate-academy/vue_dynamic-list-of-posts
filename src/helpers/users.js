import { client } from "./http";

export const getUserByEmail = (email) => {
  return client.get(`/users?email=${email}`).then(res => res[0]);
};

export const addUser = ({ name, username, email, phone }) => {
  return client.post("/users", { name, username, email, phone });
};
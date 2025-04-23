import { client } from "../utils/http.client.js";

export const getUserByEmail = (email) => {
  return client.get(`/users?email=${email}`);
};

export const addUser = ({ name, username, email, phone }) => {
  return client.post("/users", { name, username, email, phone });
};

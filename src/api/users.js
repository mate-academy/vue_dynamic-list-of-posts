import { client } from "@/utils/httpClient";

export const getUsers = () => {
  return client.get("/users");
};

export const getUserByEmail = (email) => {
  return client.get("/users?email=" + encodeURIComponent(email));
};

export const createUser = (userData) => {
  return client.post("/users", userData);
};

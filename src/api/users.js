import { client } from "../utils/client";

export const getUsers = () => {
  return client.get(`/users`);
};
import { client } from "../utils/httpClient";

export const login = (email) => {
  return client.get(`/users?email=${email}`);
};

export const register = (email, name) => {
  return client.post(`/users`, { email, name });
};
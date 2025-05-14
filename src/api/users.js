import { client } from './httpClients';

export const getUserByEmail = (email) => {
  return client.get(`/users?email=${email}`);
};

export const addUser = ({ name, username, email, phone }) => {
  return client.post("/users", { name, username, email, phone });
};
import { client } from "./axiousClient"

export const getUser = async (email) => {
  return client.get(`/users?email=${email}`).then(response => response.data[0]);
}

export const createUser = async (email, name) => {
  return client.post(`/users`, {
    email,
    name,
    username: '',
    phone: '',
  });
}
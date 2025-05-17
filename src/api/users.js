import { client } from '@/utils/fetchClient.js'

export const createUser =  async (email, name) => {
  return await client.post('/users', { email, name })


}

export const getUserByEmail = async (email) => {
  return await client.get(`/users?email=${email}`)


}

export const getUsers = () => {
  return client.get(`/users`);
};

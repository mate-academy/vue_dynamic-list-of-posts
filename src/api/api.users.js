import { client } from '@/utils/fetchClient'

export const createUser =  async (email, name) => {
  return await client.post('/users', { email, name })


}

export const getUserById = async (email) => {
  return await client.get(`/users?email=${email}`)


}


export const getUsers = () => {
  return client.get(`/users`);
};

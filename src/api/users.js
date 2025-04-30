import { client } from '@/utils/http';

export const getUserByEmail = async email => {
  const user = await client.get(`/users?email=${email}`);

  return user.data;
};

export const createUser = async (email, name) => {
  const user = await client.post('/users', { email, name });

  return user.data;
};

import { client } from '../utils/http';

export const getUsers = async () => {
  const response = await client.get('/users');

  return response.data;
};

export const getUserByEmail = async (email) => {
  const users = await getUsers();

  return users.find(
    user => user.email === email,
  );
};

export const createUser = async ({ name, email }) => {
  const response = await client.post('/users', {
    name,
    username: email.split('@')[0],
    email,
    phone: '',
  });

  return response.data;
};
import { client } from '@/utils/httpClient';

export const getUser = (email) => {
  return client.get(`/users?email=${email}`);
};

export const createUser = (email, name) => {
  return client.post('/users', {
    email,
    name
  });
};

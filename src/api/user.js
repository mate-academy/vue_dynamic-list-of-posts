import { client } from '../utils/fetchClient';

export const getUserInfo = userEmail => {
  return client.get(`/users?email=${userEmail}`);
};

export const createUser = data => {
  return client.post('/users', data);
};

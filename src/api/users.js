import { client } from '@/utils/http';

export const getUser = userId => {
  return client.get(`/users/${userId}`)
    .then(response => response.data);
};
import { client } from './client';

export function getUsers() {
  return client.get('/users');
}

export function getUserByEmail(email) {
  return client.get(`/users?email=${encodeURIComponent(email)}`);
}

export function createUser(data) {
  return client.post('/users', data);
}

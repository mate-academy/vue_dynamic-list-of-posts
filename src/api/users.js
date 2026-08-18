import { request } from './client.js';

export async function getUserByEmail(email) {
  const params = new URLSearchParams({ email });
  const users = await request(`/users?${params.toString()}`);

  return users[0] || null;
}

export function createUser(user) {
  return request('/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(user),
  });
}

import client from './httpClient.js';

export async function getUser(email) {
  const response = await client.get('/users', { params: { email } });

  return response.data[0] ?? null;
}

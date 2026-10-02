export const USER_ID = 4506;
const BASE_URL = 'https://mate.academy/students-api';

export async function request(path, method = 'GET', data) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    ...(data && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  });

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  if (response.status === 204 || method === 'DELETE') return;
  const result = await response.json();
  if (result?.error) throw new Error(result.error);
  return result;
}

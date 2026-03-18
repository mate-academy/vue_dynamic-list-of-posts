const BASE_URL = 'https://mate.academy/students-api';

export const getUserByEmail = async (email) => {
  const response = await fetch(
    `${BASE_URL}/users?email=${encodeURIComponent(email)}`,
  );

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const createUser = async ({ name, email }) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};
const BASE_URL = 'https://mate-academy.github.io/students-api';

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

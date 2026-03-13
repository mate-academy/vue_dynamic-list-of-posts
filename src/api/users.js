const BASE_URL = 'https://mate.academy/students-api';

export const getUserByEmail = async (email) => {
  const response = await fetch(
    `${BASE_URL}/users?email=${encodeURIComponent(email)}`,
  );

  if (!response.ok) {
    throw new Error(
      `Server returned ${response.status}: ${response.statusText}`,
    );
  }

  return response.json();
};

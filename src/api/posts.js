const BASE_URL = 'https://mate.academy/students-api';

export const getPosts = async (userId) => {
  const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

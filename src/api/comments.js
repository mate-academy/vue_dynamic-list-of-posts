const BASE_URL = 'https://mate.academy/students-api';

export const getComments = async (postId) => {
  const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch comments for post ${postId}`);
  }

  return response.json();
};

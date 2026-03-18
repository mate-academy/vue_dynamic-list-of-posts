const BASE_URL = 'https://mate.academy/students-api';

export const getPosts = async (userId) => {
  const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

export const createPost = async ({ userId, title, body }) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ userId, title, body }),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  return true;
};
const BASE_URL = 'https://mate.academy/students-api';

export const getComments = async (postId) => {
  const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch comments for post ${postId}`);
  }

  return response.json();
};

export const createComment = async ({ postId, name, email, body }) => {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ postId, name, email, body }),
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  return response.json();
};

export const deleteComment = async (commentId) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }

  return true;
};
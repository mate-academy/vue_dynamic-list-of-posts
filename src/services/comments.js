const BASE_URL = 'https://mate-academy.github.io/students-api';

export const getComments = async () => {
  const response = await fetch(`${BASE_URL}/comments.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

export const getCommentsByPostId = async (postId) => {
  const comments = await getComments();
  return comments.filter(comment => comment.postId === postId);
};

export const createComment = async (comment) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        ...comment
      });
    }, 500);
  });
};

export const deleteComment = async (id) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

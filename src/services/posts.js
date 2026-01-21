const BASE_URL = 'https://mate-academy.github.io/students-api';

export const getPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const getPostsByUserId = async (userId) => {
  const posts = await getPosts();
  return posts.filter(post => post.userId === userId);
};

export const createPost = async (post) => {
  // Simulating API call - in real app would POST to server
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        ...post
      });
    }, 500);
  });
};

export const updatePost = async (id, post) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...post
      });
    }, 500);
  });
};

export const deletePost = async (id) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

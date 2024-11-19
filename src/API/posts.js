import { client } from '../utils/fetchClient';

export const getPosts = async (userId) => {
  const response = await client.get(`/posts?userId=${userId}`);

  return response.data;
};

export const addPostToServer = async (userId, postData) => {
  const response = await client.post('/posts', {
    userId,
    ...postData,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data;
};

export const editServerPost = async (postId, postData) => {
  const response = await client.patch(`/posts/${postId}`, {
    ...postData,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data;
};

export const deletePost = async (postId) => {
  const response = await client.delete(`/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data;
};

import { client } from '../utils/fetchClient';

const userId = 1846;

export const getPosts = async() => {
  const response = await client.get(`/posts?userId=${userId}`);

  return response.data;
};

export const addPostToServer = async (postData) => {
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
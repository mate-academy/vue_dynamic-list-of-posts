import { client } from '../utils/fetchClient';


export const getUsers = async () => {
  const response = await client.get('/users');

  return response.data;
};

export const addUser = async (userData) => {
  const response = await client.post('/users', {
    name: userData.name,
    username: userData.name,
    email: userData.email,
    phone: "1234567890"

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

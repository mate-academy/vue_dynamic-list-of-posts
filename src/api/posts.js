import { client } from './../utils/fetchClient';

export const getPosts = async userId => {
  const response = await client.get('/posts', {
    params: { userId },
  });

  return response.data;
};

export const addPost = async postData => {
  const response = await client.post(`/posts`, {
    ...postData,
  });

  return response.data;
};

export const editPost = async (postId, postData) => {
  const response = await client.patch(`/posts/${postId}`, postData);

  return response.data;
};

export const deletePost = async postId => {
  const response = await client.delete(`/posts/${postId}`);

  return response.data;
};

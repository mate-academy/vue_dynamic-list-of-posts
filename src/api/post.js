import { client } from "../utils/httpClient";

export const getPosts = () => {
  return client.get('/posts');
};

export const createPost = (newPost) => {
  return client.post('/posts', newPost);
};

export const updatePost = (updatePost) => {
  return client.patch('/posts', updatePost);
};

export const removePost = (postId) => {
  return client.delete(`/posts/${postId}`);
};

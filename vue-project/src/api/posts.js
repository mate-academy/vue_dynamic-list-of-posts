import { client } from "../httpClient";

export const getPosts = () => {
  return client.get('/posts?userId=2');
}

export const createPost = ({ userId, title, body }) => {
  return client.post('/posts', { userId, title, body });
}

export const deletePost = (id) => {
  return client.delete(`/posts/${id}`);
}

export const patchPost = ({ id, title, body }) => {
  return client.patch(`/posts/${id}`, { title, body });
}

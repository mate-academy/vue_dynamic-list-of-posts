import { client } from "./axiousClient"

export const getUserPosts = async (userId) => {
  return client.get(`/posts?userId=${userId}`).then(response => response.data);
}

export const createPost = async (data) => {
  return client.post('/posts', data);
}

export const updatePost = async (data) => {
  console.log(data);
  return client.patch(`/posts/${data.id}`, data);
}

export const deletePost = async (postId) => {
  return client.delete(`/posts/${postId}`);
}
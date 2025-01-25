import { client } from "@/utils/http";

export const getPosts = (userId) => {
  return client.get(`/posts?userId=${userId}`);
};

export const createPost = (newPost) => {
  return client.post('/posts', newPost);
}

export const deletePost = (postId) => {
  return client.delete(`/posts/${postId}`)
}

export const updatePost = (postId, updatedPost) => {
  return client.patch(`/posts/${postId}`, updatedPost)
}
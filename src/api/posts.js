import { client } from "../utils/httpClient";

export const getPostsByUserId = (userId) => client.get(`/posts`, {
  params: { userId },
});

export const addPost = (post) => client.post(`/posts`, post);

export const deletePost = (postId) => client.delete(`/posts/${postId}`);

export const updatePost = (postId, updatedPost) => client.patch(`/posts/${postId}`, updatedPost);


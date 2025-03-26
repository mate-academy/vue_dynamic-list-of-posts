import { client } from "@/utils/fetchClient";

export const userPosts = userId => client.get(`/posts?userId=${userId}`);

export const getOnePost = postId => client.get(`/posts/${postId}`);

export const deletePost = postId => client.delete(`/posts/${postId}`);

export const createPost = data => client.post('/posts', data);

export const updatePost = (postId, data) => client.patch(`/posts/${postId}`, data);


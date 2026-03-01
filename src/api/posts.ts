import type { Post } from "../types/Post";
import { client } from "../utils/fetchClient";

export const USER_ID = 3698;

export const getPosts = () => client.get<Post[]>(`/posts?userId=${USER_ID}`);

export const createPost = (data: Omit<Post, 'id'>) =>
  client.post<Post>('/posts', data);

export const deletePost = (postId: number) =>
  client.delete(`/posts/${postId}`);

export const updatePost = (postId: number, data: Partial<Omit<Post, 'id'>>) =>
  client.patch<Post>(`/posts/${postId}`, data);
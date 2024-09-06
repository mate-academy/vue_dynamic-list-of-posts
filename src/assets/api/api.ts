import type { Comment } from "../types/Comment";
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import { client } from "../utils/fetchClient";

export const login = (email: String) => {
  return client.get<User[]>(`/users?email=${email}`);
};

export const register = (email: String, name: String) => {
  return client.post<User>("/users", { email, name });
};

export const getPosts = (userId: Number) => {
  return client.get<Post[]>(`/posts?userId=${userId}`);
};

export const addPost = (post: Omit<Post, "id">) => {
  return client.post<Post>("/posts", post);
};

export const removePost = (postId: Number) => {
  return client.delete(`/posts/${postId}`);
};

export const updatePost = (postId: Number, post: Post) => {
  return client.patch<Post>(`/posts/${postId}`, post);
};

export const getComments = (postId: Number) => {
  return client.get<Comment[]>(`/comments?postId=${postId}`);
};

export const addComment = (comment: Omit<Comment, "id">) => {
  return client.post<Comment>("/comments", comment);
};

export const removeComment = (commentId: Number) => {
  return client.delete(`/comments/${commentId}`);
};

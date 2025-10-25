import type { Comment, CommentData } from "../types/Comment";
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import { client } from "../utils/fetchClient";

export const UsersAPI = {
  getAll: () => client.get<User[]>(`/users`),
  getSingleUser: (id: number) => client.get<User>(`/users/${id}`),
};

export const PostsAPI = {
  getPostById: (id: number) => client.get<Post>(`/posts/${id}`),
  getPostsByUserId: (userId: number) =>
    client.get<Post[]>(`/posts?userId=${userId}`),
  addPost: (newPost: Post) => client.post<Post>(`/posts`, newPost),
  editPost: (newPost: Post, id: number) =>
    client.patch<Post>(`/posts/${id}`, newPost),
  deletePost: (id: number) => client.delete(`/posts/${id}`),
};

export const CommentsAPI = {
  getCommentsByPostId: (postId: number) =>
    client.get<Comment[]>(`/comments?postId=${postId}`),
  addComment: (newComment: CommentData) =>
    client.post<Comment>(`/comments`, newComment),
  editComment: (newComment: CommentData, id: number) =>
    client.patch<Comment>(`/comments/${id}`, newComment),
  deleteComment: (id: number) => client.delete(`/comments/${id}`),
};

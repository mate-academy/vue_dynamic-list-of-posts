import axios from 'axios'
import type { PatchPostBody, Post, PostPostBody, Comment, PostCommentBody, User, PostUserBody } from './types/types'

const httpClient = axios.create({
  baseURL: 'https://mate.academy/students-api',
});

export const getUser = (userId: number): Promise<User> => {
  return httpClient.get(`/users/${userId}`)
    .then((response) => response.data);
}

export const getUsersByEmail = (email: string): Promise<User[]> => {
  return httpClient.get(`/users?email=${email}`)
    .then((response) => response.data);
}

export const postUser = (user: PostUserBody): Promise<User> => {
  return httpClient.post('/users', user)
    .then((response) => response.data);
}

export const getPosts = (userId: number): Promise<Post[]> => {
  return httpClient.get(`/posts?userId=${userId}`)
    .then((response) => response.data);
}

export const postPost = (post: PostPostBody): Promise<Post> => {
  return httpClient.post('/posts', post)
    .then((response) => response.data);
}

export const patchPost = (postId: number, post: PatchPostBody): Promise<Post> => {
  return httpClient.patch(`/posts/${postId}`, post)
    .then((response) => response.data);
}

export const deletePost = (postId: number): Promise<Post> => {
  return httpClient.delete(`/posts/${postId}`)
    .then((response) => response.data);
}

export const getComments = (postId: number): Promise<Comment[]> => {
  return httpClient.get(`/comments?postId=${postId}`)
    .then((response) => response.data);
}

export const postComment = (comment: PostCommentBody): Promise<Comment> => {
  return httpClient.post('/comments', comment)
    .then((response) => response.data);
}

export const deleteComment = (commentId: number): Promise<Comment> => {
  return httpClient.delete(`/comments/${commentId}`)
    .then((response) => response.data);
}

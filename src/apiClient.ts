import axios from "axios";
import { Post } from "./types/post";
import { User } from "./types/user";

const apiClientPosts = axios.create({
  baseURL: "https://mate.academy/students-api",
});

export const getPosts = async (user: number) => {
  const res = await apiClientPosts.get(`/posts?userId=${user}`);

  return res.data;
};

export const createNewPost = async ({ userId, title, body }: Post): Promise<Post> => {
  const res = await apiClientPosts.post(`/posts`, {
    userId,
    title,
    body,
  });

  return res.data;
};

export const patchPost = async ({ id, title, body }: Post): Promise<Post> => {
  const res = await apiClientPosts.patch(`/posts/${id}`, {
    title,
    body,
  });

  return res.data;
};

export const deletePost = async (postId: number) => {
  const res = await apiClientPosts.delete(`/posts/${postId}`);

  return res.data;
};

export const getUsersList = async () => {
  const res = await apiClientPosts.get(`/users`);

  return res.data;
};

export const getUser = async (user: number) => {
  const res = await apiClientPosts.get(`/users/${user}`);

  return res.data;
};

export const createUser = async ({ username, email }: User) => {
  const res = await apiClientPosts.post(`/users`, {
    name: username,
    username,
    email,
    phone: "1234567890",
  });

  return res.data;
};

export const getPostComments = async (postId: number) => {
  const res = await apiClientPosts.get(`/comments?postId=${postId}`);

  return res.data;
};

import axios from "axios";

const api = axios.create({
  baseURL: "https://mate-academy.github.io/fe-students-api",
});

export const getUsers = () => api.get("/users");

export const createUser = (user) => api.post("/users", user);

export const getPosts = (userId) => api.get("/posts", { params: { userId } });

export const createPost = (post) => api.post("/posts", post);

export const updatePost = (postId, post) => api.patch(`/posts/${postId}`, post);

export const deletePost = (postId) => api.delete(`/posts/${postId}`);

export const getComments = (postId) =>
  api.get("/comments", { params: { postId } });

export const createComment = (comment) => api.post("/comments", comment);

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);

export default api;

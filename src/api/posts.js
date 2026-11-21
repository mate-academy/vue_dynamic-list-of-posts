import axios from "axios";

const API_URL = "https://mate.academy/students-api";

export function getPostsByUser(userId) {
  return axios.get(`${API_URL}/posts`, {
    params: { userId },
  });
}

export function createPost(post) {
  return axios.post(`${API_URL}/posts`, post);
}

export function updatePost(postId, post) {
  return axios.patch(`${API_URL}/posts/${postId}`, post);
}

export function deletePost(postId) {
  return axios.delete(`${API_URL}/posts/${postId}`);
}

export function getCommentsByPost(postId) {
  return axios.get(`${API_URL}/comments`, {
    params: { postId },
  });
}

export function createComment(comment) {
  return axios.post(`${API_URL}/comments`, comment);
}

export function deleteComment(commentId) {
  return axios.delete(`${API_URL}/comments/${commentId}`);
}

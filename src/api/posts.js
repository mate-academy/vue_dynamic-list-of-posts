const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getPosts = async (userId = "") => {
  const url = userId
    ? `${BASE_URL}/posts?userId=${userId}`
    : `${BASE_URL}/posts`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export const getPost = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  if (!response.ok) throw new Error("Failed to fetch post");
  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const updatePost = async (postId, postData) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) throw new Error("Failed to update post");
  return response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete post");

  return {};
};

export const getComments = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

export const createComment = async (commentData) => {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) throw new Error("Failed to create comment");
  return response.json();
};

export const deleteComment = async (commentId) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete comment");
  return {};
};

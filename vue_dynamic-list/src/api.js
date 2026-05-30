const BASE_URL = "https://mate-academy.github.io/fe-students-api";

export const getUserByEmail = async (email) => {
  const response = await fetch(`${BASE_URL}/users?email=${email}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const users = await response.json();
  return users.length > 0 ? users[0] : null;
};

export const createUser = async (name, email) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

export const fetchPosts = async (userId) => {
  const url = userId
    ? `${BASE_URL}/posts?userId=${userId}`
    : `${BASE_URL}/posts`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load posts");
  }

  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export const updatePost = async (postId, postData) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return true;
};

export const fetchComments = async (postId) => {
  const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);

  if (!response.ok) {
    throw new Error("Failed to load comments");
  }

  return response.json();
};

export const createComment = async (commentData) => {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
};

export const deleteComment = async (commentId) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  return true;
};

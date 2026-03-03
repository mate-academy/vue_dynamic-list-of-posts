const BASE_URL = "https://mate.academy/students-api";
const USER_ID = 1;

async function request(url, options = {}) {
  const { method = "GET", body } = options;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (method === "GET") {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(`${BASE_URL}${url}`, config);

  if (!response.ok) {
    throw new Error(`Помилка сервера: ${response.status}`);
  }

  return response.json();
}

export const getPosts = () => request(`/posts?userId=${USER_ID}`);

export const createPost = (data) =>
  request("/posts", {
    method: "POST",
    body: { ...data, userId: USER_ID },
  });

export const updatePost = (postId, data) =>
  request(`/posts/${postId}`, {
    method: "PATCH",
    body: data,
  });

export const deletePost = (postId) =>
  request(`/posts/${postId}`, {
    method: "DELETE",
  });

export const getComments = (postId) => request(`/comments?postId=${postId}`);

export const createComment = (data) =>
  request("/comments", {
    method: "POST",
    body: data,
  });

export const deleteComment = (commentId) =>
  request(`/comments/${commentId}`, {
    method: "DELETE",
  });

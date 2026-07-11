import { BASE_URL, getData } from "@/utils/httpClient";

export function getPosts(userId) {
  return getData(`/posts?userId=${userId}`);
}

export async function registerUser(email, userName) {
  const res = await fetch(BASE_URL + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, userName }),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  const data = await res.json();

  return data;
}

export async function getMe(email) {
  const res = await fetch(BASE_URL + `/users?email=${email}`);

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();

  return data;
}

export async function deletePost(id) {
  const res = await fetch(BASE_URL + `/posts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete post failed");
  }

  const data = await res.json();

  return data;
}

export async function getComments(postId) {
  const res = await fetch(BASE_URL + `/comments?postId=${postId}`);

  if (!res.ok) {
    throw new Error("Get comments failed");
  }

  const data = await res.json();

  return data;
}

export async function deleteComment(commentId) {
  const res = await fetch(BASE_URL + `/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete comment failed");
  }

  const data = await res.json();

  return data;
}

export async function addComment(postId, name, email, body) {
  const res = await fetch(BASE_URL + "/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, name, email, body }),
  });

  if (!res.ok) {
    throw new Error("comment post failed");
  }

  const data = await res.json();

  return data;
}

export async function addPost(userId, title, body) {
  const res = await fetch(BASE_URL + "/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, title, body }),
  });

  if (!res.ok) {
    throw new Error("Add post failed");
  }

  const data = await res.json();

  return data;
}

export async function updatePost(title, body, id, userId) {
  const res = await fetch(BASE_URL + `/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, userId }),
  });

  if (!res.ok) {
    throw new Error("Update post failed");
  }

  const data = await res.json();

  return data;
}

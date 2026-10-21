const URL_BASE = "https://mate.academy/students-api";

const getUsers = async () => {
  try {
    const response = await fetch(URL_BASE + "/users");
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error("Internal error:", e.message);
  }
};

const getUser = async (param) => {
  try {
    const response = await fetch(URL_BASE + "/users?email=" + param);
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error("Internal error:", e.message);
  }
};
const postUser = async (userCadastro) => {
  try {
    const response = await fetch(URL_BASE + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCadastro),
    });
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error("Internal error:", e.message);
  }
};

const getPost = async (id) => {
    const response = await fetch(URL_BASE + "/posts?userId=" + id);
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    return await response.json();
};

const addPost = async (postCadastro) => {
  try {
    const response = await fetch(URL_BASE + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postCadastro),
    });

    if (!response.ok) {
      throw new Error(`Error adding the post: ${response.status}`);
    }
    return response.json();
  } catch (e) {
    console.error("Internal error:", e.message);
  }
};

const getComment = async (id) => {
  const response = await fetch(URL_BASE + "/comments?postId=" + id);
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status}`);
  }
  return await response.json();
};

const addComent = async (commentCadastro) => {
  try {
    const response = await fetch(URL_BASE + "/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentCadastro),
    });

    if (!response.ok) {
      throw new Error(`Error adding the post: ${response.status}`);
    }
    return response.json();
  } catch (e) {
    console.error("Internal error:", e.message);
  }
};
const updatePost = async (update) => {
  try {
    const response = await fetch(URL_BASE + "/posts/" + update.postId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      throw new Error(`Error adding the post: ${response.status}`);
    }
    return response.json();
  } catch (e) {
    console.error("Internal error:", e.message);
  }
};
const deletePost = async (postId) => {
  try {
    const response = await fetch(URL_BASE + "/posts/" + postId, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error adding the post: ${response.status}`);
    }
    return response.json();
  } catch (e) {
    console.error("Internal error:", e.message);
  }
};
const deleteComment = async (commentId) => {
  try {
    const response = await fetch(URL_BASE + "/comments/" + commentId, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting comment: ${response.status}`);
    }
    return response.json();
  } catch (e) {
    console.error("Internal error", e.message);
  }
};

const fun = {
  getUser,
  getUsers,
  postUser,
  getPost,
  addPost,
  getComment,
  addComent,
  updatePost,
  deletePost,
  deleteComment,
};

export default fun;

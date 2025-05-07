const USERS_KEY = "registered_users";
const USER_POSTS_KEY = "user_posts";

export const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

export const addUser = (newUser) => {
  const users = getUsers();
  const existingUser = users.find((user) => user.email === newUser.email);
  if (existingUser) {
    throw new Error("A user with this email is already registered.");
  }

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUserPost = (userId, newPost) => {
  const allPosts = JSON.parse(localStorage.getItem(USER_POSTS_KEY) || "{}");
  if (!allPosts[userId]) {
    allPosts[userId] = [];
  }

  if (allPosts[userId].find((post) => post.id === newPost.id)) {
    return;
  }

  allPosts[userId].push(newPost);
  localStorage.setItem(USER_POSTS_KEY, JSON.stringify(allPosts));
};

export const getUserPosts = (userId) => {
  const allPosts = JSON.parse(localStorage.getItem(USER_POSTS_KEY) || "{}");
  return allPosts[userId] || [];
};

export const deleteUserPost = (userId, postId) => {
  return new Promise((resolve, reject) => {
    const allPosts = JSON.parse(localStorage.getItem(USER_POSTS_KEY) || "{}");

    if (allPosts[userId]) {
      const postIndex = allPosts[userId].findIndex(
        (post) => post.id === postId
      );
      if (postIndex !== -1) {
        allPosts[userId].splice(postIndex, 1);
        localStorage.setItem(USER_POSTS_KEY, JSON.stringify(allPosts));
        resolve();
      } else {
        reject(`Post not found.`);
      }
    } else {
      reject(`User posts not found.`);
    }
  });
};

export const editUserPost = (userId, updatedPost) => {
  const allPosts = JSON.parse(localStorage.getItem(USER_POSTS_KEY) || "{}");
  if (allPosts[userId]) {
    const postIndex = allPosts[userId].findIndex(
      (post) => post.id === updatedPost.id
    );
    if (postIndex !== -1) {
      allPosts[userId][postIndex] = updatedPost;
      localStorage.setItem(USER_POSTS_KEY, JSON.stringify(allPosts));
    } else {
      console.warn(
        `Post with ID ${updatedPost.id} not found for user ${userId}.`
      );
    }
  } else {
    console.warn(`No posts found for user ${userId}.`);
  }
};

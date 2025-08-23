import axios from 'axios';

const postOfTodos = axios.create({
  baseURL: 'https://mate.academy/students-api',
});

export const getUserByEmail = async (email) => {
  const { data } = await postOfTodos.get(`/users`)
  return data.find((user) => user.email === email)
}

export const addNewUser = async (name, email) => {
  const { data } = await postOfTodos.post('/users', {
    name,
    email
  })
  return data;
}

export const getPostsByUserId = async (userId) => {
  const { data } = await postOfTodos.get(`/posts?userId=${userId}`)
  return data
}

export const addNewPost = async (userId, title, body) => {
  const { data } = await postOfTodos.post('/posts', {
    userId,
    title,
    body
  })
  return data;
}

export const updatePost = async (postId, title, body) => {
  const { data } = await postOfTodos.patch(`/posts/${postId}`, {
    title,
    body
  })
  return data;
}

export const deletePost = async (postId) => {
  const { data } = await postOfTodos.delete(`/posts/${postId}`)
  return data;
}

//komentarze

export const getComments = async (postId = null) => {
  try {
    const url = postId ? `/comments?postId=${postId}` : '/comments';
    const { data } = await postOfTodos.get(url);
    return data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
};

export const getCommentById = async (commentId) => {
  try {
    const { data } = await postOfTodos.get(`/comments/${commentId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch comment:', error);
    throw error;
  }
};

export const addComment = async (postId, name, email, body) => {
  try {
    const { data } = await postOfTodos.post('/comments', {
      postId,
      name,
      email,
      body,
    });
    return data;
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
};

export const updateComment = async (commentId, body, postId) => {
  try {
    const { data } = await postOfTodos.patch(`/comments/${commentId}`, {
      body,
      postId,
    });
    return data;
  } catch (error) {
    console.error('Failed to update comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const { data } = await postOfTodos.delete(`/comments/${commentId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw error;
  }
};
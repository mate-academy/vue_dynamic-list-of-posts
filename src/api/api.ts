import axios, { type AxiosResponse } from 'axios';

export const client = axios.create({
  baseURL: 'https://mate.academy/students-api',
})

type AxiosProm = Promise<AxiosResponse>;

//#region User
export const getUserByEmail: (email: string) => AxiosProm = (email) => {
  return client.get('/users', {
    params: {
      email,
    }
  })
}

export const createUser: (
  email: string,
  name: string,
) => AxiosProm = (email, name) => {
  return client.post('/users', {
    email,
    name,
  })
}
//#endregion

//#region Posts
export const getPostsByUserId: (userId: number) => AxiosProm = (userId) => {
  return client.get('/posts', {
    params: {
      userId,
    }
  })
}

export const createPost: (
  title: string,
  body: string,
  userId: number,
) => AxiosProm = (title, body, userId) => {
  return client.post('/posts', {
    title,
    body,
    userId,
  })
}

export const updatePost: (
  title: string,
  body: string,
  postId: number,
  userId: number,
) => AxiosProm = (title, body, postId, userId) => {
  return client.patch(`/posts/${postId}`, {
    title,
    body,
    userId,
  })
}

export const deletePost: (postId: number) => AxiosProm = (postId) => {
  return client.delete(`/posts/${postId}`)
}
//#endregion

//#region Comments
export const getCommentsByPostId: (postId: number) => AxiosProm = (postId) => {
  return client.get('/comments', {
    params: {
      postId,
    }
  })
}

export const createComment: (
  postId: number,
  name: string,
  body: string,
  email: string,
) => AxiosProm = (postId, name, body, email) => {
  return client.post('/comments', {
    postId,
    name,
    body,
    email,
  })
}

export const deleteComment: (commentId: number) => AxiosProm = (commentId) => {
  return client.delete(`/comments/${commentId}`)
}
//#endregion

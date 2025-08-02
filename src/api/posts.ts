import { client } from '../utils/httpClient'

export const getPostsByUserId = async (userId) => {
  return client.get(`/posts?userId=${userId}`)
}

export const removePost = async (postId) => {
  return client.delete(`/posts/${postId}`)
}

export const createPost = async (data) => {
  return client.post('/posts', data)
}

export const updatePost = async (postId, data) => {
  return client.patch(`/posts/${postId}`, data)
}

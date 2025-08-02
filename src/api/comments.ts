import { client } from '../utils/httpClient'

export const getCommentsByPostId = async (postId) => {
  return client.get(`/comments?postId=${postId}`)
}

export const removeComment = async (commentId) => {
  return client.delete(`/comments/${commentId}`)
}

export const createComment = async (data) => {
  return client.post('/comments', data)
}

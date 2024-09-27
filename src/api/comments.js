import { client } from './httpClient'

export const getPostComments = (postId) => {
  return client.get(`/comments?postId=${postId}`)
}

export const addComment = ({ postId, name, email, body }) => {
  return client.post('/comments', { postId, name, email, body })
}

export const deleteComment = (id) => {
  return client.delete(`/comments/${id}`)
}

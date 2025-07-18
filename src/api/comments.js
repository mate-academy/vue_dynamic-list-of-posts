import { client } from '@/utils/http'

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`)
}

export const addComment = (comment) => {
  return client.post('/comments', comment)
}

export const deleteComment = (id) => {
  return client.delete(`/comments/${id}`)
}

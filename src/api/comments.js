import { client } from "@/utils/httpClient"

export const getComments = (postId) => {
  return client.get(`/comments?postId=${postId}`)
}

export const deleteComment = (commentId) => {
  return client.delete(`/comments/${commentId}`)
}

export const postComment = (newComment) => {
  return client.post(`/comments`, newComment)
}


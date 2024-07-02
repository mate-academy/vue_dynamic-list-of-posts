import type { NewComment } from '@/types/Comment'
import { client } from '@/utils/httpClient'

export const getUserComments = <T>(postId: number) => {
  return client.get<T>(`/comments?postId=${postId}`)
}

export const postNewComment = (newComment: NewComment) => {
  return client.post('/comments', newComment)
}

export const removeUserComment = (id: number) => {
  return client.delete(`/comments/${id}`)
}

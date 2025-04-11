import type { Comment } from '@/types/comment'
import { client } from '@/utils/http'

export const getComment = async (postId: number): Promise<Comment[]> => {
  const response = await client.get(`/comments?postId=${postId}`)

  return response.data
}

export const getComments = async (): Promise<Comment[]> => {
  const response = await client.get(`/comments`)

  return response.data
}

type CreateCommentType = {
  postId: number
  name: string
  email: string
  body: string
}

export const deleteComment = async (commentId: number): Promise<Comment> => {
  const response = await client.delete(`/comments/${commentId}`)

  return response.data
}
export const createComment = async ({
  postId,
  name,
  email,
  body,
}: CreateCommentType): Promise<Comment> => {
  const response = await client.post(`/comments`, {
    postId,
    name,
    body,
    email,
  })

  return response.data
}

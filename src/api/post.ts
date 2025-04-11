import type { Post } from '@/types/post'
import { client } from '@/utils/http'

export const getPosts = async (userId: number): Promise<Post[]> => {
  const response = await client.get(`/posts?userId=${userId}`)

  return response.data
}

export const deletePost = async (postId : number): Promise<Post> => {
  const response = await client.delete(`/posts/${postId }`)

  return response.data
}

type CreatePostParams = {
  userId: number
  title: string
  body: string
}
type UpdatePostParams = {
  postId: number
  userId: number
  title: string
  body: string
}

export const createPost = async ({ userId, title, body }: CreatePostParams): Promise<Post> => {
  const response = await client.post(`/posts`, { userId, title, body })

  return response.data
}

export const updatePost = async ({ postId, userId, title, body }: UpdatePostParams): Promise<Post> => {
  const response = await client.patch(`/posts/${postId}`, { title, body, userId })

  return response.data
}

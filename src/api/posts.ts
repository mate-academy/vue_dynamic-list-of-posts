import { Post } from '../utils/types'
import { client } from '../utils/fetchClient'
import { getUserId } from '@/utils/LocalStorage'

export const getPosts = async (): Promise<Post[]> => {
  const userId = getUserId()

  if (!userId) {
    throw new Error('User is not logged in')
  }

  const response = await client.get(`/posts?userId=${userId}`)
  return response.data
}

export const getPost = async (id: number) => {
  const response = await client.get(`/posts/${id}`)
  return response.data
}

export const createPost = async (
  title: string,
  body: string,
): Promise<Post> => {
  const userId = getUserId()

  if (!userId) {
    throw new Error('User is not logged in')
  }

  const response = await client.post('/posts', {
    userId,
    title,
    body,
  })

  return response.data
}

export const updatePost = async (
  id: number,
  title: string,
  body: string,
): Promise<Post> => {
  const response = await client.patch(`/posts/${id}`, {
    title,
    body,
  })

  return response.data
}

export const deletePost = async (id: number): Promise<Post> => {
  const response = await client.delete(`/posts/${id}`)
  return response.data
}

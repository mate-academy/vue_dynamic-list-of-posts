import { Post } from '../utils/types'
import { client } from '../utils/fetchClient'
import { getUserId } from '@/utils/LocalStorage'

const USER_ID = getUserId()

export const getPosts = async (): Promise<Post[]> => {
  const response = await client.get(`/posts?userId=${USER_ID}`)

  return response.data
}

export const getPost = async (id: number) => {
  const response = await client.get(`/posts/${id}`)

  return response.data
}

export const createPost = async (title: string, body: string): Promise<Post> => {
  const response = await client.post('/posts', {
    userId: USER_ID,
    title,
    body,
  })

  return response.data
}

export const updatePost = async (id: number, title: string, body: string): Promise<Post> => {
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

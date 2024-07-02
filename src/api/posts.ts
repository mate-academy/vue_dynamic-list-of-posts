import type { Post } from '@/types/Post'
import { client } from '@/utils/httpClient'

export const getUserPosts = <T>(id: number) => {
  return client.get<T>(`/posts?userId=${id}`)
}

export const postNewPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  return client.post(`/posts`, post)
}

export const updatePost = (id: number, post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  return client.patch(`/posts/${id}`, post)
}

export const removePost = (id: number) => {
  return client.delete(`/posts/${id}`)
}


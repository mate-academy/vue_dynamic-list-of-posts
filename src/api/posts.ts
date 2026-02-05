import { client } from '@/utils/http.js'

const getAllPostsByUserId = async (userId: number) => {
  const response = await client.get(`/posts?userId=${userId}`)

  return response.data
}

const createPost = async (userId: string, title: string, body: string) => {
  const response = await client.post('/posts', { userId, title, body })

  return response
}

const deletePost = async (id: number) => {
  const response = await client.delete(`/posts/${id}`)

  return response
}

const updatePost = async (id: number, usersId: number, title: string, body: string) => {
  const response = await client.patch(`/posts/${id}`, { usersId, title, body })

  return response
}

export { getAllPostsByUserId, createPost, deletePost, updatePost }

import { client } from '@/utils/https'
import { getUser } from '@/utils/localStorage'
export const getPostsApi = async () => {
  const resp = await client.get(`/posts/?userId=${getUser().id}`)

  return resp.data
}

export const getPostByIdApi = async (id) => {
  const resp = await client.get(`/posts/${id}`)

  return resp.data
}

export const createNewPost = async (userId, title, body) => {
  const resp = await client.post(`/posts/`, {
    userId: userId,
    title: title,
    body: body,
  })

  return resp.data
}

export const deletePost = async (id) => {
  const resp = await client.delete(`/posts/${id}`)

  return resp.data
}

export const editPost = async (userId, { id, title, body }) => {
  const resp = await client.patch(`/posts/${id}`, { userId: userId, title: title, body: body })

  return resp.data
}

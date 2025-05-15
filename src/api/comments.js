import { client } from '@/utils/https'

export const getPostsCommentsApi = async (id) => {
  if (!id) {
    return
  }
  const resp = await client.get(`/comments?postId=${id}`)

  return resp
}

export const createComment = async (postId, name, email, body) => {
  const resp = await client.post('/comments/', {
    postId,
    name,
    email,
    body,
  })

  return resp
}

export const deleteComment = async (id) => {
  const resp = await client.delete(`/comments/${id}`)

  return resp
}

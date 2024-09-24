import { client } from './httpClient'

export const getPostsByUserId = (userId) => {
  return client.get(`/posts?userId=${userId}`)
}

export const addPost = ({ userId, title, body }) => {
  return client.post('/posts', { userId, title, body })
}

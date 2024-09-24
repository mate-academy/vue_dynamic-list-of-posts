import { client } from './httpClient'

export const getPostsByUserId = (userId) => {
  return client.get(`/posts?userId=${userId}`)
}

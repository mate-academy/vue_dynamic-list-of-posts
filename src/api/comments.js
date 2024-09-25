import { client } from './httpClient'

export const getPostComments = (postId) => {
  return client.get(`/comments?postId=${postId}`)
}

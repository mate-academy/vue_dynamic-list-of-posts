import { client } from '../httpClient'

export const posts = {
  get(userId) {
    return client.get(`/posts?userId=${userId}`)
  },
  post(data) {
    return client.post('/posts', data)
  },
  delete(postId) {
    return client.delete(`/posts/${postId}`)
  },
  update(data) {
    return client.patch(`/posts/${data.id}`, data)
  },
}

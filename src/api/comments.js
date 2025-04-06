import { client } from '../httpClient'

export const comments = {
  get(postId) {
    return client.get(`/comments?postId=${postId}`)
  },
  post(data) {
    return client.post('/comments', data)
  },
  delete(postId) {
    return client.delete(`/comments/${postId}`)
  },
  update(data) {
    return client.patch(`/comments/${data.id}`, data)
  },
}

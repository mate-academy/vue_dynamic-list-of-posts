import { client } from '@/utils/http'

export const getPosts = () => {
  return client.get('/posts?userId=2049')
}

export const addPost = (post) => {
  return client.post('/posts', post)
}

export const deletePost = (id) => {
  return client.delete(`/posts/${id}`)
}

export const updatePost = (post) => {
  return client.patch(`/posts/${post.id}`, post)
}

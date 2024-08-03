import { client } from '@/services/httpClient'

interface User {
  email: string
  name: string
}
interface Post {
  title: string
  body: string
}
interface Comment {	
  postId: number,
  name: string,
  email: string,
  body: string
}

export const getUser = (email: string) => {
  return client.get(`/users?email=${email}`)
}

export const createUser = (user: User) => {
  return client.post('/users', user)
}

export const getUserPosts = (userId: number) => {
  return client.get(`/posts?userId=${userId}`)
}

export const createUserPost = (post: Post) => {
  return client.post('/posts', post)
}

export const updateUserPost = (postId: number, newPost: Post) => {
  return client.patch(`/posts/${postId}`, newPost)
}

export const deleteUserPost = (postId: number) => {
  return client.delete(`/posts/${postId}`)
}

export const getComments = (postId: number) => {
  return client.get(`/comments/?postId=${postId}`)
}

export const creareUserComment = (newComment: Comment) => {
  return client.post('/comments/', newComment)
}

export const deleteUserComment = (commentId: number) => {
  return client.delete(`/comments/${commentId}`)
}
